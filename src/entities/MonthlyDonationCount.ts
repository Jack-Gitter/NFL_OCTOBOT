
import { Column, Entity } from "typeorm";

@Entity()
export class MonthlyDonationCount {

    @Column({primary: true})
    id: number

    @Column({type: 'float'})
    money: number

    @Column()
    topDonatorName: string

    @Column({type: 'float'})
    topDonatorAmount: number
    
}
