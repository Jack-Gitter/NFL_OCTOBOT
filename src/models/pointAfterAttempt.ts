import { Athlete } from "./athlete";

export class PointAfterAttempt {
    constructor(public success: boolean, public isTwoPointAttempt: boolean, public scorer?: Athlete) { }
}
