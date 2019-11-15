import * as bcrypt from 'bcryptjs';
import * as yup from 'yup';
import { ResolverMap } from "../../types/graphql-utils";
import { User } from '../../entity/index';
import { formatYupError } from '../../utils/formatYupError';
import {
   duplicateEmail,
   emailNotLongEnough,
   invalidEmail,
   passwordNotLongEnough,
   invalidLogin,
    confirmEmailError,
    forgotPasswordLockError,
    userDoesNotExist,
    expiredRedisKeyError
} from './errorMessages';

import { createConfirmEmailLink } from '../../utils/createConfirmEmailLink';
import { userSessionIdPrefix, forgotPasswordPrefix } from '../../constants/constants';
import { removeAllUsersSessions } from '../../utils/removeUserSessions';
import { forgotPasswordLockAccount } from '../../utils/forgotPasswordLockAccount';
import { createForgotPasswordLink } from '../../utils/createForgotPasswordLink';

const passwordValidation = yup
    .string()
    .min(8, passwordNotLongEnough)
    .max(255);

const schema = yup.object().shape({
    email: yup
        .string()
        .min(3, emailNotLongEnough)
        .max(255)
        .email(invalidEmail),
    password: passwordValidation,
    description: yup
        .string()
        .max(300),
    latitude: yup
        .number(),
    longitude: yup
        .number()
});

const newPasswordSchema = yup.object().shape({
    newPassword: passwordValidation
});

const loginErrorResponse = [
    {
        path: "email",
        message: invalidLogin
    }
];
export const resolvers: ResolverMap = {
    Query: {
        users: async (_: any) => {
            const users = await User.find();

            return users;
        },
        user: async (_: any, { id }) => {
            const user = await User.findOne({ where: { id } });

            return user
        }
    },
    Mutation: {
        
        register: async (_: any, args: GQL.IRegisterOnMutationArguments, { redis, url }) => {

            try {
                await schema.validate(args, { abortEarly: false });
            } catch (err) {
                return formatYupError(err);
            }

            const { email, password, username } = args;
            const userAlreadyExists = await User.findOne({
                where: { email },
                select: ["id"]
            });

            if (userAlreadyExists) {
                return [
                    {
                        path: "email",
                        message: duplicateEmail
                    }
                ];
            }

            const user = User.create({
                email,
                password,
                username
            });

            await user.save();

            await createConfirmEmailLink(url, user.id, redis);

            return null;
        },
        login: async (_: any, { email, password }: GQL.ILoginOnMutationArguments, { session, redis, req }) => {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return loginErrorResponse;
            }

            if (!user.confirmed) {
                return [
                    {
                        path: 'email',
                        message: confirmEmailError
                    }
                ];
            }

            if (user.forgotPasswordLock) {
                return [
                    {
                        path: 'email',
                        message: forgotPasswordLockError
                    }
                ];
            }


            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                return loginErrorResponse;
            }

            session.userId = user.id;
            if (req.sessionID) {
                await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
            }

            return null;
        },
        logout: async (_, __, { session, redis }) => {
            const { userId } = session;
            if (userId) {
                removeAllUsersSessions(userId, redis);
                return true;
            }

            return false;
        },
        sendForgotPasswordEmail: async (_: any, { email }: GQL.ISendForgotPasswordEmailOnMutationArguments, { redis }) => {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return [
                    {
                        path: 'email',
                        message: userDoesNotExist
                    }
                ];
            }

            await forgotPasswordLockAccount(user.id, redis);
            await createForgotPasswordLink("", user.id, redis);

            return true;
        },
        forgotPasswordChange: async (_: any, { newPassword, key }: GQL.IForgotPasswordChangeOnMutationArguments, { redis }) => {
            const redisKey = `${forgotPasswordPrefix}${key}`;
            const userId = await redis.get(redisKey);

            if (!userId) {
                return [
                    {
                        path: 'key',
                        message: expiredRedisKeyError
                    }
                ];
            }

            try {
                await newPasswordSchema.validate({ newPassword }, { abortEarly: false });
            } catch (err) {
                return formatYupError(err);
            }

            const hashPassword = await bcrypt.hash(newPassword, 10);

            const updatePromise = User.update({ id: userId }, {
                forgotPasswordLock: false,
                password: hashPassword
            });

            const deleteKeyPromise = redis.del(redisKey);

            await Promise.all([updatePromise, deleteKeyPromise]);

            return null;
        }
    
    }
};
