import Attendee from "../models/Attendee.js";
import { BaseRepository } from "./baseRepository.js";

class AttendeeRepository extends BaseRepository {
  constructor() {
    super(Attendee);
  }
}

export default new AttendeeRepository();
