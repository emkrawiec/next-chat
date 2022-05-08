import { prisma } from "../../prisma/init"

export const getPriceByID = async (priceId: number) => {
  try {
    const feature = await prisma.price.findUnique({
      where: {
        ID: priceId
      }
    });

    return feature;
  } catch (err: unknown) {
    console.log(err);
  }
}