import { PrismaClient } from "@prisma/client";

export default async function normAuto() {
  const prisma = new PrismaClient();

  const lastNorm = await prisma.pasien.findFirst({
    orderBy: {
      id: "desc",
    },
    select: {
      noRm: true,
    },
  });

  let lastNumber: string | undefined = lastNorm?.noRm.slice(4);

  if (!lastNumber) {
    const yearNow = new Date().getFullYear().toString();
    return yearNow + "00001";
  } else {
    const year: any = lastNorm?.noRm.slice(0, 4);
    if (year == new Date().getFullYear().toString() || year == undefined) {
      let numericalNumber: number = parseInt(lastNumber);
      numericalNumber++;
      if (numericalNumber < 10) {
        return year + "0000" + numericalNumber;
      } else if (numericalNumber < 100) {
        return year + "000" + numericalNumber;
      } else if (numericalNumber < 1000) {
        return year + "00" + numericalNumber;
      } else if (numericalNumber < 10000) {
        return year + "0" + numericalNumber;
      } else if (numericalNumber < 100000) {
        return year + numericalNumber;
      }
    } else {
      const yearNow = new Date().getFullYear().toString();
      return yearNow + "00001";
    }
  }
}
