import defineAssetsModel from '@/app/lib/models/assets';
import { sequelize } from '@/app/lib/sequelize';

// Initialize the Assets model
const Assets = defineAssetsModel(sequelize);


export async function getUserTotalBalance(userId) {
  const assets = await Assets.findOne({ where: { userId } });
  if (!assets) return 0;

  const exchange = parseFloat(assets.exchange) || 0;
  const trade = parseFloat(assets.trade) || 0;
  const perpetual = parseFloat(assets.perpetual) || 0;

  const total = exchange + trade + perpetual;
  return parseFloat(total.toFixed(2));
}
