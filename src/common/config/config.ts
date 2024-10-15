import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const env = process.env.NODE_ENV ?? 'default';

const YAML_FILE_CONFIG = `${env}.yaml`;

export default () => {
  return yaml.load(readFileSync(join(__dirname, 'config', YAML_FILE_CONFIG), 'utf8')) as Record<
    string,
    string | number
  >;
};
