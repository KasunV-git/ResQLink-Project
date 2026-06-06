/**
 * Sri Lanka geographic reference data
 * Used across the app for location pickers, validation, and display.
 *
 * Structure mirrors Sri Lanka's administrative hierarchy:
 *   Province → District → Common locations / relief centres
 */

export const SL_PROVINCES = [
  'Western Province',
  'Central Province',
  'Southern Province',
  'Northern Province',
  'Eastern Province',
  'North Western Province',
  'North Central Province',
  'Uva Province',
  'Sabaragamuwa Province',
];

/** All 25 districts with their parent province */
export const SL_DISTRICTS = [
  // Western
  { district: 'Colombo',      province: 'Western Province' },
  { district: 'Gampaha',      province: 'Western Province' },
  { district: 'Kalutara',     province: 'Western Province' },
  // Central
  { district: 'Kandy',        province: 'Central Province' },
  { district: 'Matale',       province: 'Central Province' },
  { district: 'Nuwara Eliya', province: 'Central Province' },
  // Southern
  { district: 'Galle',        province: 'Southern Province' },
  { district: 'Matara',       province: 'Southern Province' },
  { district: 'Hambantota',   province: 'Southern Province' },
  // Northern
  { district: 'Jaffna',       province: 'Northern Province' },
  { district: 'Kilinochchi',  province: 'Northern Province' },
  { district: 'Mannar',       province: 'Northern Province' },
  { district: 'Mullaitivu',   province: 'Northern Province' },
  { district: 'Vavuniya',     province: 'Northern Province' },
  // Eastern
  { district: 'Trincomalee',  province: 'Eastern Province' },
  { district: 'Batticaloa',   province: 'Eastern Province' },
  { district: 'Ampara',       province: 'Eastern Province' },
  // North Western
  { district: 'Kurunegala',   province: 'North Western Province' },
  { district: 'Puttalam',     province: 'North Western Province' },
  // North Central
  { district: 'Anuradhapura', province: 'North Central Province' },
  { district: 'Polonnaruwa',  province: 'North Central Province' },
  // Uva
  { district: 'Badulla',      province: 'Uva Province' },
  { district: 'Monaragala',   province: 'Uva Province' },
  // Sabaragamuwa
  { district: 'Ratnapura',    province: 'Sabaragamuwa Province' },
  { district: 'Kegalle',      province: 'Sabaragamuwa Province' },
];

/**
 * High-disaster-risk areas grouped by hazard type.
 * Sourced from DMC and NBRO historical data.
 */
export const SL_DISASTER_ZONES = {
  flood: [
    'Kelaniya, Gampaha District',
    'Kaduwela, Colombo District',
    'Biyagama, Gampaha District',
    'Ratnapura Town, Sabaragamuwa Province',
    'Matara Town, Southern Province',
    'Galle City, Southern Province',
    'Batticaloa Town, Eastern Province',
    'Trincomalee Town, Eastern Province',
  ],
  landslide: [
    'Aranayake, Kegalle District',
    'Meeriyabedda, Badulla District',
    'Badulla Town, Uva Province',
    'Nuwara Eliya Town, Central Province',
    'Ratnapura District, Sabaragamuwa Province',
    'Kandy Outskirts, Central Province',
  ],
  cyclone: [
    'Trincomalee Coastal Belt, Eastern Province',
    'Batticaloa Coastal Belt, Eastern Province',
    'Jaffna Peninsula, Northern Province',
    'Galle Coastal Zone, Southern Province',
    'Matara Coastal Zone, Southern Province',
    'Hambantota Coastal Zone, Southern Province',
  ],
  tsunami: [
    'Galle District Coastline, Southern Province',
    'Matara District Coastline, Southern Province',
    'Hambantota District Coastline, Southern Province',
    'Trincomalee District Coastline, Eastern Province',
    'Batticaloa District Coastline, Eastern Province',
    'Jaffna District Coastline, Northern Province',
    'Puttalam District Coastline, North Western Province',
  ],
};

/**
 * Common relief centres and community shelters used in Sri Lanka disaster response.
 * Names reflect real facility types (Pradeshiya Sabha Halls, Maha Vidyalayas, etc.)
 */
export const SL_RELIEF_CENTRES = [
  // Western Province
  'Kelaniya Relief Camp, Gampaha District',
  'Kaduwela Divisional Secretariat, Colombo District',
  'Maharagama Community Relief Centre, Colombo District',
  'Kalutara Pradeshiya Sabha Hall, Kalutara District',
  // Sabaragamuwa Province
  'Ratnapura Pradeshiya Sabha Office, Ratnapura District',
  'Kegalle District Secretariat, Kegalle District',
  // Central Province
  'Kandy Town Temporary Shelter, Kandy District',
  'Nuwara Eliya District Secretariat, Nuwara Eliya District',
  // Southern Province
  'Galle Kachcheri Relief Centre, Galle District',
  'Matara District Secretariat, Matara District',
  'Hambantota Pradeshiya Sabha Hall, Hambantota District',
  // Northern Province
  'Jaffna Community Centre, Jaffna District',
  'Vavuniya District Secretariat, Vavuniya District',
  // Eastern Province
  'Trincomalee Divisional Secretariat, Trincomalee District',
  'Batticaloa Kachcheri, Batticaloa District',
];

/** Phone number format hint for Sri Lanka */
export const SL_PHONE_PLACEHOLDER = '+94 77 123 4567';

/** Date format used in Sri Lanka (DD/MM/YYYY) */
export const SL_DATE_FORMAT = 'DD/MM/YYYY';

export default SL_DISTRICTS;
