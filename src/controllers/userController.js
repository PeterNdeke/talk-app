import makeValidation from "@withvoid/make-validation";
import UserRepository from "../repositories/userRepository.js";
export default {
  createUser: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          first_name: { type: types.string },
          last_name: { type: types.string },
          email: { type: types.string },
        },
      }));
      if (!validation.success) return res.status(400).json({ ...validation });

      const { firstName, lastName, email } = req.body;
      //check if a user with email already exist
      const checkUser = await UserRepository.findOne({ email }, { _id: -1 });
      if (checkUser) {
        return res.status(400).json({
          success: false,
          error: `user with email ${email} already exist`,
        });
      }
      const user = await UserRepository.create(req.body);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await UserRepository.all();
      return res.status(200).json({ success: true, users });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
};
