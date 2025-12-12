import { DataSource } from "typeorm"
import { Donation } from "./entities/Donation"

export interface DonatorInformation {
	donatorId: number
	donatorName: string,
	donatorMoney: number,
}

export const generateDates = (startDate: Date, endDate: Date) => {
  const dates: Date[] = []
  const current = new Date(startDate)

  current.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)

  while (current <= endDate) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

export const getHighestAllTimeDonators = async (datasource: DataSource): Promise<DonatorInformation[]> => {
    const donationRepository = datasource.getRepository(Donation)
    const result = await donationRepository
        .createQueryBuilder("donation")
        .select("donation.donatorId", "donatorId")
        .addSelect("MAX(donation.donatorName)", "donatorName") // get latest name
        .addSelect("SUM(donation.money)", "total")
        .groupBy("donation.donatorId")
        .orderBy("total", "DESC")
        .limit(3)
        .getRawMany();
      return result 
}

export const getHighestMonthlyDonator = async (datasource: DataSource) => {

  const donationRepository = datasource.getRepository(Donation)

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const result = await donationRepository
        .createQueryBuilder("donation")
        .select("donation.donatorId", "donatorId")
        .addSelect("MAX(donation.donatorName)", "donatorName") // get latest name
        .addSelect("SUM(donation.money)", "total")
        .where("donation.timestamp >= :start", { start: startOfMonth })
        .andWhere("donation.timestamp < :end", { end: startOfNextMonth })
        .groupBy("donation.donatorId")
        .orderBy("total", "DESC")
        .limit(1)
        .getRawOne();

  return result 
}

export const getMonthlyDonationCount = async (datasource: DataSource) => {

  const donationRepository = datasource.getRepository(Donation)

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const result = await donationRepository
    .createQueryBuilder("donation")
    .select("SUM(donation.money)", "total")
    .where("donation.timestamp >= :start", { start: startOfMonth })
    .andWhere("donation.timestamp < :end", { end: startOfNextMonth })
    .getRawOne();

  return result 
}
