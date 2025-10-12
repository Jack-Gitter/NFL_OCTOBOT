import { DataSource, EntityManager, Equal, MoreThan } from "typeorm";
import { OctopusCount } from "../entities/OctopusCount";
import { ScoringPlay } from "../entities/Play";
import { PlayerOctopusCount } from "../entities/PlayerOctopusCount";
import { SCORER_TYPE } from "../espn_api/types";
import { Athlete } from "./athlete";
import { PointAfterAttempt } from "./pointAfterAttempt";
import { postFailedOctopusToTwitter, postOctopusToTwitter } from "../x_api/x_api";
import TwitterApi from "twitter-api-v2";

export class ScoringPlayInformation {
    constructor(
        public id: string,
        public participants: Athlete[],
        public pointAfterAttempt: PointAfterAttempt,
        public shortText: string,
        public text: string,
        public wallclock: Date,
        public octopusScorer?: Athlete,
        public octopusMissedAthlete?: Athlete,
    ) {}

    public isOctopus() {
        if (this.pointAfterAttempt.isTwoPointAttempt && this.pointAfterAttempt.success && this.pointAfterAttempt.scorer) {
            const tdScorer = this.participants.find((participant: Athlete) => {
                return participant.type === SCORER_TYPE.TD_SCORER
            })
            return (tdScorer && this.pointAfterAttempt.scorer.id === tdScorer.id) 
        }
        return false
    }

    public isMissedOctopus() {
        if (this.pointAfterAttempt.isTwoPointAttempt && !this.pointAfterAttempt.success && this.pointAfterAttempt.scorer) {
            const tdScorer = this.participants.find((participant: Athlete) => {
                return participant.type === SCORER_TYPE.TD_SCORER
            })
            return (tdScorer && this.pointAfterAttempt.scorer.id === tdScorer.id) 
        }
        return false

    }

    public async saveOctopusToDatabase(datasource: DataSource) {
        await datasource.transaction(async (entityManager: EntityManager) => {
            const scoringPlayRepository = entityManager.getRepository(ScoringPlay)
            const octopusCountRepository = entityManager.getRepository(OctopusCount)
            const playerOctopusCountRepository = entityManager.getRepository(PlayerOctopusCount)
            if (this.octopusScorer) {
                const playerId = this.octopusScorer?.id
                const play = new ScoringPlay(this.id)
                await scoringPlayRepository.save(play)
                await octopusCountRepository.increment({id: '1'}, 'count', 1)
                const playerOctopusCount = await playerOctopusCountRepository.findOneBy({id: playerId})
                if (!playerOctopusCount) {
                    const newPlayerOctopusCount = new PlayerOctopusCount(playerId, 1)
                    await playerOctopusCountRepository.save(newPlayerOctopusCount)
                } else {
                    playerOctopusCount.octopusCount += 1
                    await playerOctopusCountRepository.save(playerOctopusCount)
                }
                console.log(`Successfully saved the playId ${this.id}`)
                console.log(`Successfully updated player octopus count for player with id ${playerId}`)
                console.log(`Successfully updated global octopus count`)
            }
        })
    }

    public async saveFailedOctopusScoringPlayToDatabase(datasource: DataSource) {
        const scoringPlayRepository = datasource.getRepository(ScoringPlay)
        const scoringPlay = new ScoringPlay(this.id)
        await scoringPlayRepository.save(scoringPlay)
    }

    public async postFailedOctopusToTwitter(twitterClient: TwitterApi, datasource: DataSource) {

        const octopusCountRepository = datasource.getRepository(OctopusCount)
        const octopusCount = await octopusCountRepository.findOneBy({id: '1'}) 
        if (this.octopusMissedAthlete && octopusCount) {
            await postFailedOctopusToTwitter(twitterClient, this.shortText, this.octopusMissedAthlete?.firstName, this.octopusMissedAthlete?.lastName, octopusCount?.count + 1)
        }

    }

    public async postOctopusToTwitter(twitterClient: TwitterApi, datasource: DataSource) {
        let playerOctopusCount = 0
        let globalOctopusCount = 0
        let playerOctopusRanking = 0
        let playerOctopusRankingTiedWith = 0
        await datasource.transaction(async (entityManager) => {
            if (this.octopusScorer)  {
                const playerOctopusCountRepository = entityManager.getRepository(PlayerOctopusCount)
                const octopusCountRepository = entityManager.getRepository(OctopusCount)

                const octopusCount = await octopusCountRepository.findOneBy({id: '1'})
                const playerOctopus = await playerOctopusCountRepository.findOneBy({id: this.octopusScorer.id})

                if (playerOctopus && octopusCount) {
                    globalOctopusCount = octopusCount.count
                    playerOctopusCount = playerOctopus.octopusCount
                    playerOctopusRanking = await playerOctopusCountRepository.count({where: {octopusCount: MoreThan(playerOctopusCount)}}) + 1
                    playerOctopusRankingTiedWith = await playerOctopusCountRepository.count({where: {octopusCount: Equal(playerOctopusCount)}}) - 1
                }

            }
        })

        if (this.octopusScorer) {
            return await postOctopusToTwitter(
                twitterClient, 
                this.shortText,
                this.octopusScorer?.firstName, 
                this.octopusScorer?.lastName, 
                playerOctopusCount, 
                globalOctopusCount,
                playerOctopusRanking,
                playerOctopusRankingTiedWith
            )
        }
    }
    public async populateOctopusPlayerInformation() {
        this.octopusScorer = this.pointAfterAttempt.scorer
    }

    public async populateFailedOctopusPlayerInformation() {
        this.octopusMissedAthlete = this.pointAfterAttempt.scorer
    }
}
