import { Pool } from 'pg';
import { variables } from '../utilities/variables.js';

const postgres = new Pool(variables.postgres);

export default postgres;