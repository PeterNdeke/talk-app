//import User from "../models/user";
import User from "../models/user.js";
import { BaseRepository } from "./baseRepository.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }
}

export default new UserRepository();
