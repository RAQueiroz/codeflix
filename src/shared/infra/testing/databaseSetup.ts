import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Config } from "../config";

export function setupSequelize(opts: SequelizeOptions = {}){
  let _sequelize: Sequelize

  beforeAll(async () => {
    _sequelize = new Sequelize({
      ...Config.db(),
      ...opts
    });
  });

  beforeEach(async () => {
    await _sequelize.sync({ force: true });
  })

  afterAll(async () => await _sequelize.close())

  return {
    get sequelize(){
      return _sequelize
    }
  }
}
