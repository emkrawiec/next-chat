import { PROFILE_CUSTOMIZATION_FEATURE_CONFIG } from '@next-chat/shared/config';
import { prisma }  from './init';

const seedProfileCustomizationFeature = async () => {
  const feature =  await prisma.feature.create({
    data: {
      ID: PROFILE_CUSTOMIZATION_FEATURE_CONFIG.feature.id,
      featureId: PROFILE_CUSTOMIZATION_FEATURE_CONFIG.feature.paymentGatewayProductId,
    }
  })
  
  await prisma.price.create({
    data: {
      ID: PROFILE_CUSTOMIZATION_FEATURE_CONFIG.price.id,
      priceId: PROFILE_CUSTOMIZATION_FEATURE_CONFIG.price.paymentGatewayPriceId,
      featureId: feature.ID,
    }
  });
}

const seedFeatures = async () => {
  await seedProfileCustomizationFeature();
}

const main = async () => {
  await seedFeatures();
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  })
  .then(async () => {
    await prisma.$disconnect();
  });