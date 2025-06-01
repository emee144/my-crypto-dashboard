import { initModels } from '@/app/lib/models';
const { Assets } = initModels();

export async function getUserTotalBalance(userId) {
  const assets = await Assets.findOne({ where: { userId } });
  if (!assets) return 0;

  const exchange = parseFloat(assets.exchange) || 0;
  const trade = parseFloat(assets.trade) || 0;
  const perpetual = parseFloat(assets.perpetual) || 0;

  const total = exchange + trade + perpetual;
  return total.toFixed(2); // ensures it returns a string like "4500.00"
}
