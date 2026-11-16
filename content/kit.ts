import { photosIn } from '@/components/Photo';

/**
 * The lights and props strips on the home page. Like the gallery, they are not a list of
 * their own: every photo in photos/lights and photos/props is in them, in file-name order.
 * To add one, drop the photo in the folder and run `npm run images`. Cut-outs on a clear
 * background look best; the empty space round them is trimmed off by itself.
 *
 * NAMES gives each photo the words a screen reader and Google Images get, also shown under
 * it in the viewer. A photo without a line here still shows, called "Light" or "Prop".
 */

/** How many lights come free with a booking; more are charged extra. */
export const FREE_LIGHTS = 2;

const NAMES: Record<string, string> = {
  // photos/lights
  '13.png': 'Octagonal softbox',
  '14.png': 'Octagonal softbox',
  '15.png': 'Reflector with honeycomb grids',
  '16.png': 'Snoot',
  '17.png': 'Barn doors',
  '18.png': 'Standard reflector',
  '19.png': 'Beauty dish',
  '20.png': 'Wide reflector',
  '21.png': 'Softlight reflector',
  '22.png': 'Reflector discs',
  '23.png': 'LED spotlight',
  '24.png': 'LED spotlight',
  '25.png': 'LED spotlight',
  '26.png': 'Projection attachment',
  '27.png': 'Umbrella softbox on a stand',
  '28.png': 'Boom stand with a sandbag',
  '29.png': 'Boom stand',
  '30.png': 'C-stand',
  '31.png': 'Light stand',
  '32.png': 'Flash head on a stand',
  '33.png': 'Black flags',
  '34.png': 'Super clamp',
  '35.png': '5-in-1 reflector',

  // photos/props
  '026A0479.webp': 'Plant in a tall vase',
  '026A0483.webp': 'Painted tyres',
  '026A0487.webp': 'Potted palm',
  '026A0493-Photoroom.webp': 'White arch blocks',
  '026A0495.webp': 'White shelf block',
  '026A0496-Photoroom.webp': 'White arch',
  '026A0497-Photoroom.webp': 'White half-round block',
  '026A0498.webp': 'Wooden boxes',
  '026A0500.webp': 'Flowers on a wooden side table',
  '026A0502.webp': 'Wooden chair with a teal seat',
  '026A0505.webp': 'Teal velvet chair',
  '026A0557.webp': 'Round gold side table',
  '026A0558.webp': 'Green cushioned stool',
  '026A0559.webp': 'Green dice seat',
  '026A0561.webp': 'Blossom tree in a pot',
  '026A0563.webp': 'White bar stool',
  '026A0567.webp': 'Wooden chair with a cream seat',
  '026A0568.webp': 'Folding wooden chair',
  '026A0569.webp': 'Shell chair',
  '026A0570.webp': 'Concrete planters',
  '026A0572.webp': 'Metal drum',
  '026A0632.webp': 'Plant stand with flowers',
  '026A0633.webp': 'Roses in a woven vase',
  '026A0634.webp': 'Flowers in a red vase',
  '026A0636.webp': 'Blue flowers in a white vase',
  '026A0637.webp': 'Grass in a black vase',
  '026A0638.webp': 'Red flowers in a white urn',
  '026A0639-Photoroom.webp': 'Grass in a small pot',
  '026A0641.webp': 'Dried leaves in a white urn',
  '026A0643.webp': 'Sunflowers in a black vase',
  '026A0645.webp': 'Bonsai in a green bowl',
  '026A1159.webp': 'Clay pots',
  '026A1166.webp': 'Pink arch',
  '026A1173-Photoroom.webp': 'Dried flowers in a clay pot',
  '026A5499.webp': 'Folding wooden chair',
  '026A5515-Photoroom.webp': 'White bar stool',
  '026A5518.webp': 'Wooden chair with a cream seat',
  '026A5530.webp': 'Pair of upholstered chairs',
  '026A5532.webp': 'Black bar stool',
  '026A5535.webp': 'Carved wooden chair',
  '026A5560.webp': 'Wooden picnic table',
  '026A5561.webp': 'Red dice seat',
  '026A5575.webp': 'Leafy plant in a white vase',
  '026A5590.webp': 'Tall mirror',
  '026A5593.webp': 'Lanterns',
  '026A5599.webp': 'Folding camping chair',
  '026A5600.webp': 'Folding stool',
  '0G2B0241-Photoroom.webp': 'White display blocks with a vase',
  '0G2B8778-Photoroom.webp': 'Copper kettle',
  '0G2B8780-Photoroom.webp': 'Cricket helmet',
  '0G2B8781-Photoroom.webp': 'Retro radio',
  '0G2B8784-Photoroom.webp': 'Vintage speaker',
  '0G2B8786-Photoroom.webp': 'Model biplane',
  '0G2B8802-Photoroom.webp': 'Vintage book',
  '0G2B8803-Photoroom.webp': 'Binoculars and case',
  '0G2B8805-Photoroom.webp': 'Sewing machine',
  '0G2B8814-Photoroom.webp': 'Headphones',
  '0G2B8816-Photoroom.webp': 'Red toy car',
  '0G2B8818-Photoroom.webp': 'Film camera',
  '0G2B8826-Photoroom.webp': 'Boxing gloves',
  '0G2B8827-Photoroom.webp': 'Coca-Cola tin',
  '0G2B8837.webp': 'Basketball',
  '0G2B8847-Photoroom.webp': 'Skateboard',
  '0G2B8848.webp': 'Painted skateboard',
  '0G2B8849-Photoroom.webp': 'Dumbbells',
  '0G2B8853.webp': 'Baseball bat',
  '0G2B8854.webp': 'Golf club',
  '0G2B8861-Photoroom.webp': 'Leather bag',
  '0G2B8862.webp': 'Rotary phone',
  '0G2B8874.webp': 'Painted clay pot',
  '0G2B8876-Photoroom.webp': 'Stacked wine glasses',
  '0G2B8882-Photoroom.webp': 'Cassette player',
  '0G2B8883-Photoroom.webp': 'Lantern',
  '0G2B8886.webp': 'Boombox',
  '0G2B9954.webp': 'Red payphone',
  '0G2B9983.webp': 'Wooden chair with arms',
};

export type KitItem = { src: string; name: string };

const items = (folder: string, fallback: string): KitItem[] =>
  photosIn(folder).map((src) => ({ src, name: NAMES[src.slice(folder.length + 1)] ?? fallback }));

export const LIGHTS = items('lights', 'Light');
export const PROPS = items('props', 'Prop');

/** How wide a tile is drawn: 100px on a phone, 140px wider up. */
export const KIT_SIZES = '(max-width: 640px) 100px, 140px';
