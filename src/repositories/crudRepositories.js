export default function crudRepository(model) {
  return {
    create: async function (data) {
      const newDoc = await model.create(data);
      return newDoc;
    },
    getAll: async function (data) {
      const allDocs = await model.find(data);
      return allDocs;
    },
    getById: async function (id) {
      const doc = await model.findById(id);
      return doc;
    },
    // getByName:async(name)=>{
    //     const docBYName=await this.model.findOne({name});
    //     return docBYName
    // },
    delete: async function (id) {
      const response = await model.findByIdAndDelete(id);
      return response;
    },


    // deletemany is a mongoose function that takes conditions by which they works $in checks that id is present or not in that model 
    deleteMany: async function (modelIds) {
      const response = await model.deleteMany({ 
        _id: { $in: modelIds } });
      return response;
    },
    update: async function (id, data) {
      const updatedDoc = await model.findByIdAndUpdate(id, data, {
        new: true
      });
      return updatedDoc;
    }
  };
}
