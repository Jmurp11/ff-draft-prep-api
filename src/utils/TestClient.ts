import * as rp from 'request-promise';
import request = require('request');

export class TestClient {
    url: string;
    options: {
        jar: request.CookieJar,
        withCredentials: boolean,
        json: boolean
    }

    constructor(url: string) {
        this.url = url;
        this.options = {
            jar: rp.jar(),
            withCredentials: true,
            json: true
        }
    }

    async login(email: string, password: string) {
        return rp.post(this.url, {
            ...this.options,
            body: {
                query: `
                    mutation {
                        login(email: "${email}", password: "${password}") {
                            path
                            message
                        }
                    }
                `
            }
        });
    }

    async logout() {
        return rp.post(this.url, {
            ...this.options,
            body: {
                query: `
                    mutation {
                        logout
                    }
                `
            }
        });
    }

    async me() {
        return rp.post(this.url, {
            ...this.options,
            body: {
                query: `
                    {
                        me {
                            id
                            email
                        }
                    }
                `
            }
        });
    }

    async register(email: string, password: string, username: string) {
        return rp.post(this.url, {
            ...this.options,
            body: {
                query: `
                    mutation {
                        register(email: "${email}", password: "${password}" username: "${username}") {
                            path
                            message
                        }
                    }
                `
            }
        });
    }

    async forgotPasswordChange(newPassword: string, key: string) {
        return rp.post(this.url, {
            ...this.options,
            body: {
                query: `
                    mutation {
                        forgotPasswordChange(newPassword: "${newPassword}", key: "${key}") {
                            path
                            message
                        }
                    }
                `
            }
        });
    }

    async createTeam(city: string, nickname: string, 
    abbreviation: string, bye: number, rank: number, 
    passRank: number, rushRank: number, imageUrl: string, pointsFor: number,
    yards: number, plays: number, yardsPerPlay: number,
    turnovers: number, passAttempts: number,
    passCompletions: number, passYards: number,
    passTd: number, interception: number,
    netYardsPerPass: number, rushAttempt: number,
    rushYards: number, rushTd: number, yardsPerRush: number,
    scorePercentage: number, turnoverPercentage: number,
    offensiveLineRank: number, runningBackSoS: number) {
        return rp.post(this.url, {
            ...this.options,
            body: {
                query: `
                    mutation {
                        createTeam(city: "${city}", nickname: "${nickname}", 
                            abbreviation: "${abbreviation}", bye: ${playerData.bye}, rank: ${rank}, 
                            passRank: ${passRank}, rushRank: ${rushRank}, imageUrl: "${imageUrl}", pointsFor: ${pointsFor},
                            yards: ${yards}, plays: ${plays}, yardsPerPlay: ${yardsPerPlay},
                            turnovers: ${turnovers}, passAttempts: ${passAttempts},
                            passCompletions: ${passCompletions}, passYards: ${passYards},
                            passTd: ${passTd}, interception: ${interception},
                            netYardsPerPass: ${netYardsPerPass}, rushAttempt: ${rushAttempt},
                            rushYards: ${rushYards}, rushTd: ${rushTd}, yardsPerRush: ${yardsPerRush},
                            scorePercentage: ${scorePercentage}, turnoverPercentage: ${turnoverPercentage},
                            offensiveLineRank: ${offensiveLineRank}, runningBackSoS: ${runningBackSoS}) {
                            path
                            message
                        }
                    }
                `
            }
        });
    }

    async createPlayer(firstName: string, lastName: string, 
    team: string, position: string, rank: string,
    adp: string, tier: string) {
        return rp.post(this.url, {
            ...this.options,
            body: {
                query: `
                    mutation {
                        createPlayer(firstName: "${firstName}", lastName: "${lastName}", 
                            team: "${team}", position: "${position}", rank: ${rank},
                            adp: ${adp}, tier: "${tier}") {
                            path
                            message
                        }
                    }
                `
            }
        });
    }

    async addProjection(firstName: string, lastName: string, 
        team: string, completions: string, attempts: string, 
        passYards: string, passTd: string, 
        interception: string, carries: string, rushYards: string, rushTd: string, 
        fumbles: string, receptions: string, receivingYards: string, 
        receivingTd: string, fantasyPoints: string) {
            return rp.post(this.url, {
                ...this.options,
                body: {
                    query: `
                        mutation {
                            addProjection(firstName: "${firstName}", lastName: "${lastName}", team: "${team}", completions: ${completions}, attempts: ${attempts}, 
                            passYards: ${passYards}, passTd: ${passTd}, 
                            interception: ${interception}, carries: ${carries}, rushYards: ${rushYards}, rushTd: ${rushTd}, 
                            fumbles: ${fumbles}, receptions: ${receptions}, receivingYards: ${receivingYards}, 
                            receivingTd: ${receivingTd}, fantasyPoints: ${fantasyPoints}) {
                                path
                                message
                            }
                        }
                    `
                }
            });
        }

}