import { User } from '../../entity/index';
import {
    user as userData,
    shared
} from '../../constants/test-constants';
import {
    duplicateEmail,
    emailNotLongEnough,
    passwordNotLongEnough,
    invalidEmail,
    invalidLogin,
    confirmEmailError
} from './errorMessages';
import { createTypeormConn } from '../../utils/createTypeOrmConn';
import { Connection } from 'typeorm';
import { TestClient } from '../../utils/TestClient';

let conn: Connection;

beforeEach(async () => {
    conn = await createTypeormConn();
});

afterEach(async () => {
    conn.close();
});

describe("Register user", () => {
    it("check for duplicate emails", async () => {
        const client = await new TestClient(process.env.TEST_HOST as string);
        const email = `${Math.floor((Math.random() * 10000) + 1).toString()}${userData.email}`;
        // make sure we can register a user
        const response = await client.register(email, userData.password, userData.description, shared.latitude, shared.longitude);

        expect(response.data).toEqual({ register: null });
        const users = await User.find({ where: { email } });
        expect(users).toHaveLength(1);
        const user = users[0];
        expect(user.email).toEqual(email);
        expect(user.password).not.toEqual(userData.password);

        const response2: any = await client.register(email, userData.password, userData.description, shared.latitude, shared.longitude);

        expect(response2.data.register).toHaveLength(1);
        expect(response2.data.register[0]).toEqual({
            path: "email",
            message: duplicateEmail
        });
    });

    it("check bad email", async () => {
        const client = await new TestClient(process.env.TEST_HOST as string);

        const response3: any = await client.register("b", userData.password, userData.description, shared.latitude, shared.longitude);
        expect(response3.data).toEqual({
            register: [
                {
                    path: "email",
                    message: emailNotLongEnough
                },
                {
                    path: "email",
                    message: invalidEmail
                }
            ]
        });
    });

    it("check bad password", async () => {
        // catch bad password
        const client = await new TestClient(process.env.TEST_HOST as string);

        const response4: any = await client.register(userData.email, 'abcd', userData.description, shared.latitude, shared.longitude);
        expect(response4.data).toEqual({
            register: [
                {
                    path: "password",
                    message: passwordNotLongEnough
                }
            ]
        });
    });

    it("check bad password and bad email", async () => {
        const client = await new TestClient(process.env.TEST_HOST as string);

        const response5: any = await client.register('df', 'abcd', userData.description, shared.latitude, shared.longitude);

        expect(response5.data).toEqual({
            register: [
                {
                    path: "email",
                    message: emailNotLongEnough
                },
                {
                    path: "email",
                    message: invalidEmail
                },
                {
                    path: "password",
                    message: passwordNotLongEnough
                }
            ]
        });
    });

    it("register user", async () => {
        const email = `${Math.floor((Math.random() * 10000) + 1).toString()}${userData.email}`;
        const password = userData.password;
        const description = userData.description;
        const client = await new TestClient(process.env.TEST_HOST as string);

        const response = await client.register(email, userData.password, userData.description, shared.latitude, shared.longitude);

        expect(response.data).toEqual({ register: null });

        const users = await User.find({ where: { email } });

        
        expect(users).toHaveLength(1);

        const userTest = users[0];

        expect(userTest.email).toEqual(email);
        expect(userTest.password).not.toEqual(password)
        expect(userTest.description).toEqual(description);

    })
});

describe('Login User', () => {
    it('test login with invalid credentials returns error', async () => {
        const client = await new TestClient(process.env.TEST_HOST as string);

        const response = await client.login('bademail@email.com', 'badpass');

        expect(response.data).toEqual({
            login: [
                {
                    path: 'email',
                    message: invalidLogin
                }
            ]
        });
    });

    it('test login with email not confirmed', async () => {
        const email = userData.email;
        const client = await new TestClient(process.env.TEST_HOST as string);

        await client.register(email, userData.password, userData.description, shared.latitude, shared.longitude);

        const response = await client.login(email, userData.password);

        expect(response.data).toEqual({
            login: [
                {
                    path: 'email',
                    message: confirmEmailError
                }
            ]
        });
    });

    it('test login with wrong password returns error', async () => {
        const wrongPassword = 'wrongPassword';
        const email = 'testEmail1@test.com';
        await User.create({
            email,
            password: userData.password,
            description: userData.description,
            latitude: shared.longitude,
            longitude: shared.longitude,
            confirmed: true
        }).save();

        const client = await new TestClient(process.env.TEST_HOST as string);

        const response = await client.login(email, wrongPassword);
        expect(response.data).toEqual({
            login: [
                {
                    path: 'email',
                    message: invalidLogin
                }
            ]
        });
    });

    it('test login with correct credentials', async () => {
        const email = userData.email;
        const client = await new TestClient(process.env.TEST_HOST as string);

        await client.register(email, userData.password, userData.description, shared.latitude, shared.longitude);

        await User.update({ email }, { confirmed: true });

        const response = await client.login(email, userData.password);

        expect(response.data).toEqual({ login: null });
    });

    it('test update email', async () => {
        const email = `${Math.floor((Math.random() * 10000) + 1).toString()}${userData.email}`;
        const newEmail = 'newEmail@test.com';
        const password = userData.password;
        const description = userData.description;
        const client = await new TestClient(process.env.TEST_HOST as string);

        const response = await client.register(email, userData.password, userData.description, shared.latitude, shared.longitude);

        expect(response.data).toEqual({ register: null });

        const users = await User.find({ where: { email } });

        
        expect(users).toHaveLength(1);

        const userTest = users[0];

        expect(userTest.email).toEqual(email);
        expect(userTest.password).not.toEqual(password)
        expect(userTest.description).toEqual(description);

        const response2 = await client.editUserEmail(userTest.id, newEmail);

        expect(response2.data).toEqual({ editUserEmail: null });

        const updatedUsers = await User.find({ where: { newEmail } });

        const updateTest = updatedUsers[0];

        expect(updateTest.email).toEqual(newEmail);
        expect(updateTest.password).not.toEqual(password)
        expect(updateTest.description).toEqual(description);
    });

    it('test update description', async () => {
        const email = `${Math.floor((Math.random() * 10000) + 1).toString()}${userData.email}`;
        const newDescription = 'This is my new description';
        const password = userData.password;
        const description = userData.description;
        const client = await new TestClient(process.env.TEST_HOST as string);

        const response = await client.register(email, userData.password, userData.description, shared.latitude, shared.longitude);

        expect(response.data).toEqual({ register: null });

        const users = await User.find({ where: { email } });

        
        expect(users).toHaveLength(1);

        const userTest = users[0];

        expect(userTest.email).toEqual(email);
        expect(userTest.password).not.toEqual(password)
        expect(userTest.description).toEqual(description);

        const response2 = await client.editUserDescription(userTest.id, newDescription);

        expect(response2.data).toEqual({ editUserDescription: null });

        const updatedUsers = await User.find({ where: { email } });

        const updateTest = updatedUsers[0];

        expect(updateTest.email).toEqual(email);
        expect(updateTest.password).not.toEqual(password)
        expect(updateTest.description).toEqual(newDescription);
    });
});