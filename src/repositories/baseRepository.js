export class BaseRepository {
  constructor(Model) {
    this.Model = Model;
  }

  create(payload) {
    return this.Model.create(payload);
  }

  findById(id) {
    return this.Model.findOne({ _id: id });
  }

  findOne(condition, sort = {}) {
    return this.Model.findOne(condition).sort(sort);
  }

  all(condition, sort = {}, page = null, limit = 100) {
    try {
      if (page) {
        delete condition.page;
        delete condition.limit;
        return this.Model.paginate(condition, {
          sort,
          page,
          limit: parseInt(limit),
        });
      } else {
        return this.Model.find(condition).sort(sort);
      }
    } catch (e) {
      console.log(e);
      return this.Model.find(condition).sort(sort);
    }
  }

  massInsert(data = []) {
    if (data.length === 0) return [];

    return this.Model.insertMany(data);
  }

  count(condition = {}) {
    return this.Model.find(condition).countDocuments();
  }
  upsert(query = {}, newData = {}) {
    return this.Model.update(query, newData, {
      upsert: true,
      setDefaultsOnInsert: true,
    });
  }

  update(query = {}, newData = {}) {
    return this.Model.updateMany(query, newData);
  }

  getModel() {
    return this.Model;
  }
}
