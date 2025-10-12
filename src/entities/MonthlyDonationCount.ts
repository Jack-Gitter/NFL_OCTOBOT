
import { Column, Entity } from "typeorm";

@Entity()
export class MonthlyDonationCount {

    @Column({primary: true})
    id: number

    @Column()
    money: number
    
}
