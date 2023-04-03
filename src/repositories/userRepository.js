//import User from "../models/user";
import User from "../models/User.js";
import { BaseRepository } from "./baseRepository.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async getUserByIds(ids) {
    try {
      const users = await this.Model.find({ _id: { $in: ids } });
      return users;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserRepository();
