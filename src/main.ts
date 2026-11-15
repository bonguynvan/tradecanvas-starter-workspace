import './style.css';
import { BinanceAdapter } from '@tradecanvas/chart';
import { ChartWidgetGrid } from '@tradecanvas/chart/widget';

// The name the workspace is saved under on the first visit.
const LAYOUT_NAME = 'My workspace';

const container = document.getElementById('grid');
if (!container) throw new Error('index.html needs an element with id="grid"');

const grid = new ChartWidgetGrid(container, {
  layout: '2x2',
  // Options every chart shares.
  widget: { theme: 'dark', timeframe: '15m' },
  // An adapter keeps one live stream, so each chart gets its own.
  adapter: () => new BinanceAdapter(),
  // Each chart's own options, by position: left to right, top to bottom.
  cells: [{ symbol: 'BTCUSDT' }, { symbol: 'ETHUSDT' }, { symbol: 'SOLUSDT' }, { symbol: 'BNBUSDT' }],
  // What the charts follow from each other. The bar above the charts toggles
  // each of these too. Symbol sync stays off here: it would put the same pair
  // on all four charts.
  sync: { crosshair: true, interval: true, time: true, symbol: false },
  // Named layouts in this browser's localStorage (the default storage). Open
  // the one saved last on start; changes are saved by themselves.
  layouts: { openLast: true },
  // Runs for each chart as it is made (at the start, and when the grid grows).
  onChartAdd: (widget) => {
    widget.getChart().addIndicator('ema', { period: 21 });
  },
});

// The first visit has nothing saved yet: save the workspace under a name, so
// every later change (arrangement, sync, symbols, intervals, indicators,
// drawings) is kept and comes back on the next visit.
async function keepLayout(): Promise<void> {
  const session = grid.getLayoutSession();
  if (!session) return;
  const saved = await session.list();
  if (saved.length === 0) await session.saveAs(LAYOUT_NAME);
}
keepLayout().catch((error: unknown) => {
  grid.getActiveWidget().toast(error instanceof Error ? error.message : 'Could not save the layout', 'error');
});

// Vite hot reload: drop the old grid (its streams, listeners and DOM) before
// the edited module makes a new one.
import.meta.hot?.dispose(() => grid.destroy());
