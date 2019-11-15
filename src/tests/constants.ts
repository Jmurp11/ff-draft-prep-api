export const host = 'http://localhost:4000';

export const createTeam = `
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
            offensiveLineRank: ${offensiveLineRank}, runningBackSoS: ${runningBackSoS})
    }
`;

export const createPlayer = (team: string) => {
    const mutation = `
        mutation {
            createPlayer(firstName: "${firstName}", lastName: "${lastName}", 
                team: "${team}", position: "${position}", rank: ${rank},
                adp: ${adp}, tier: "${tier}")
        }
    `;
    return mutation;
};

export const addProjection = (firstName: string, lastName: string, team: string): string => {
    const mutation = `
            mutation {
                addProjection(firstName: "${firstName}", lastName: "${lastName}", team: "${team}", completions: ${completions}, attempts: ${attempts}, 
                    passYards: ${passYards}, passTd: ${passTd}, 
                    interception: ${interception}, carries: ${carries}, rushYards: ${rushYards}, rushTd: ${rushTd}, 
                    fumbles: ${fumbles}, receptions: ${receptions}, receivingYards: ${receivingYards}, 
                    receivingTd: ${receivingTd}, fantasyPoints: ${fantasyPoints})
            }
        `
    return mutation;
};

export const teams = `
    query {
        teams {
            id,
            city,
            nickname,
            abbreviation,
            bye,
            imageUrl,
            rank,
            passRank,
            rushRank,
            pointsFor,
            yards,
            plays,
            yardsPerPlay,
            turnovers,
            passAttempts,
            passCompletions,
            passYards,
            passTd,
            interception,
            netYardsPerPass,
            rushAttempt,
            rushYards,
            rushTd,
            yardsPerRush,
            scorePercentage,
            turnoverPercentage,
            offensiveLineRank,
            runningBackSoS
        }
    }
`;

export const teamById = (id: number) => {
    const query = `
        query {
            teamById(id: ${id}) {
                id,
                city,
                nickname,
                abbreviation,
                bye,
                imageUrl,
                rank,
                passRank,
                rushRank,
                pointsFor,
                yards,
                plays,
                yardsPerPlay,
                turnovers,
                passAttempts,
                passCompletions,
                passYards,
                passTd,
                interception,
                netYardsPerPass,
                rushAttempt,
                rushYards,
                rushTd,
                yardsPerRush,
                scorePercentage,
                turnoverPercentage,
                offensiveLineRank,
                runningBackSoS
            }
        }
    `;

    return query;
};

export const teamByAbbreviation = (abbreviation: string) => {
    const query = `
        query {
            teamByAbbreviation(abbreviation: "${abbreviation}") {
                id,
                city,
                nickname,
                abbreviation,
                bye,
                imageUrl,
                rank,
                passRank,
                rushRank,
                pointsFor,
                yards,
                plays,
                yardsPerPlay,
                turnovers,
                passAttempts,
                passCompletions,
                passYards,
                passTd,
                interception,
                netYardsPerPass,
                rushAttempt,
                rushYards,
                rushTd,
                yardsPerRush,
                scorePercentage,
                turnoverPercentage,
                offensiveLineRank,
                runningBackSoS
            }
        }
    `;

    return query;
};

export const playerById = (id: number): string => {
    const query = `
        query {
            playerById(id: ${id}) {
                id,
                firstName,
                lastName,
                team {
                    id,
                    city,
                    nickname,
                    abbreviation,
                    bye,
                    imageUrl,
                    rank,
                    passRank,
                    rushRank,
                    pointsFor,
                    yards,
                    plays,
                    yardsPerPlay,
                    turnovers,
                    passAttempts,
                    passCompletions,
                    passYards,
                    passTd,
                    interception,
                    netYardsPerPass,
                    rushAttempt,
                    rushYards,
                    rushTd,
                    yardsPerRush,
                    scorePercentage,
                    turnoverPercentage,
                    offensiveLineRank,
                    runningBackSoS
                },
                position,
                rank,
                tier
            }
        }
    `;

    return query;
}

export const players = `
    query {
        players {
            id,
            firstName,
            lastName,
            team {
                id,
                city,
                nickname,
                abbreviation,
                bye,
                imageUrl,
                rank,
                passRank,
                rushRank,
                pointsFor,
                yards,
                plays,
                yardsPerPlay,
                turnovers,
                passAttempts,
                passCompletions,
                passYards,
                passTd,
                interception,
                netYardsPerPass,
                rushAttempt,
                rushYards,
                rushTd,
                yardsPerRush,
                scorePercentage,
                turnoverPercentage,
                offensiveLineRank,
                runningBackSoS
            },
            position,
            rank,
            tier
        }
    }
`;

export const projections = `
    query {
        projections {
            id,
            player {
                id,
                firstName,
                lastName,
                team {
                    id,
                    city,
                    nickname,
                    abbreviation,
                    bye,
                    imageUrl,
                    rank,
                    passRank,
                    rushRank,
                    pointsFor,
                    yards,
                    plays,
                    yardsPerPlay,
                    turnovers,
                    passAttempts,
                    passCompletions,
                    passYards,
                    passTd,
                    interception,
                    netYardsPerPass,
                    rushAttempt,
                    rushYards,
                    rushTd,
                    yardsPerRush,
                    scorePercentage,
                    turnoverPercentage,
                    offensiveLineRank,
                    runningBackSoS
                }
                position,
                rank,
                tier
            },
            platform, 
            completions,             
            attempts,
            passYards,
            passTd,
            interception,
            carries,
            rushYards,
            rushTd,
            fumbles,
            receptions,
            receivingYards,
            receivingTd,
            fantasyPoints
        }
    }
`;

export const projectionsByPlatform = (platform: string): string => {
    const query = `
        query {
            projectionsByPlatform(platform: "${platform}") {
                id,
                player {
                    id,
                    firstName,
                    lastName,
                    team {
                        id,
                        city,
                        nickname,
                        abbreviation,
                        bye,
                        imageUrl,
                        rank,
                        passRank,
                        rushRank,
                        pointsFor,
                        yards,
                        plays,
                        yardsPerPlay,
                        turnovers,
                        passAttempts,
                        passCompletions,
                        passYards,
                        passTd,
                        interception,
                        netYardsPerPass,
                        rushAttempt,
                        rushYards,
                        rushTd,
                        yardsPerRush,
                        scorePercentage,
                        turnoverPercentage,
                        offensiveLineRank,
                        runningBackSoS
                    }
                    position,
                    rank,
                    tier
                }, 
                completions,             
                attempts,
                passYards,
                passTd,
                interception,
                carries,
                rushYards,
                rushTd,
                fumbles,
                receptions,
                receivingYards,
                receivingTd,
                fantasyPoints
            }
        }
    `;

    return query;
};

export const projectionsByPlayer = (player: number): string => {
    const query = `
        query {
            projectionsByPlayer(player: ${player}) {
                id,
                player { 
                    id,
                    firstName,
                    lastName,
                    team {
                        id,
                        city,
                        nickname,
                        abbreviation,
                        bye,
                        imageUrl,
                        rank,
                        passRank,
                        rushRank,
                        pointsFor,
                        yards,
                        plays,
                        yardsPerPlay,
                        turnovers,
                        passAttempts,
                        passCompletions,
                        passYards,
                        passTd,
                        interception,
                        netYardsPerPass,
                        rushAttempt,
                        rushYards,
                        rushTd,
                        yardsPerRush,
                        scorePercentage,
                        turnoverPercentage,
                        offensiveLineRank,
                        runningBackSoS
                    }
                    position,
                    rank,
                    tier
                }, 
                completions,             
                attempts,
                passYards,
                passTd,
                interception,
                carries,
                rushYards,
                rushTd,
                fumbles,
                receptions,
                receivingYards,
                receivingTd,
                fantasyPoints
            }
        }
    `;

    return query;
}