<template>
  <n-space>
    <n-button
      type="primary"
      circle
      @click="edit({ id: record.id, field: 'edit', value: !record.edit })"
      :disabled="record.edit || record.id < 0"
    >
      <template #icon>
        <n-icon><pencil /></n-icon>
      </template>
    </n-button>

    <n-popconfirm
      @positive-click="deleteData(record.id)"
      negative-text="取消"
      positive-text="确认"
    >
      <template #trigger>
        <n-button type="error" circle>
          <template #icon>
            <n-icon><delete-outlined /></n-icon>
          </template>
        </n-button>
      </template>
      确认删除？
    </n-popconfirm>

    <n-button type="info" circle :disabled="!record.edit" @click="saveData(record.id)">
      <template #icon>
        <n-icon><save-outlined /></n-icon>
      </template>
    </n-button>

    <n-button v-if="record.showAdd" circle ghost @click="create">
      <template #icon>
        <n-icon> <add-twotone /> </n-icon>
      </template>
    </n-button>
  </n-space>
</template>
<script>
import { NSpace, NButton, NIcon, NPopconfirm } from "naive-ui";
import { Pencil } from "@vicons/ionicons5";
import { SaveOutlined, DeleteOutlined, AddTwotone } from "@vicons/material";
import { mapMutations, mapActions } from "vuex";
export default {
  name: "OperationButtons",
  props: {
    record: {
      type: Object,
    },
    table: {
      type: String,
    },
  },
  methods: {
    edit(data) {
      this.$store.commit(this.table + "/edit", data);
    },
    create() {
      this.$store.commit(this.table + "/create");
    },
    saveData(id) {
      this.$store.dispatch(this.table + "/saveData", id);
    },
    deleteData(id) {
      this.$store.dispatch(this.table + "/deleteData", id);
    },
  },
  components: {
    NSpace,
    NButton,
    Pencil,
    NIcon,
    DeleteOutlined,
    SaveOutlined,
    AddTwotone,
    NPopconfirm,
  },
};
</script>
