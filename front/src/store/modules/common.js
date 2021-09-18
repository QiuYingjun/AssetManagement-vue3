function dumpData(data, records) {
  records.forEach((element) => {
    element.edit = false;
    data.push(element);
  });
  data[0].showAdd = true;
}

function create(data, record) {
  if (data.length > 0) {
    data[0].showAdd = false;
  }
  record.showAdd = true;
  record.edit = true;
  data.splice(0, 0, record);
}
function edit(data, { id, field, value }) {
  var record = data.find((r) => r.id == id);
  if (record) {
    record[field] = value;
  }
}
function remove(data, id) {
  var i = 0;
  for (i; i < data.length; i++) {
    if (data[i].id == id) {
      break;
    }
  }
  if (i < data.length) {
    data.splice(i, 1);
  }
  if (data[0]) {
    data[0].showAdd = true;
  }
}
export default {
  dumpData,
  create,
  edit,
  remove,
};
