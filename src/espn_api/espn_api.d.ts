import { Athlete } from "./types";
export declare const getDailyGameIds: (date?: Date) => Promise<number[]>;
export declare const getGameScoringPlayIds: (gameId: number) => Promise<{
    gameId: number;
    scoringPlayIds: number[];
}>;
export declare const getOctopusInformation: (gameId: number, scoringPlayId: number) => Promise<{
    scorer: string;
    shortText: string;
} | undefined>;
export declare const getAtheleteInformation: (playerUrl: string) => Promise<Athlete>;
//# sourceMappingURL=espn_api.d.ts.map