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
    <n-button type="error" circle>
      <template #icon>
        <n-icon><delete-outlined /></n-icon>
      </template>
    </n-button>
    <n-button type="info" circle :disabled="!record.edit">
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
import { NSpace, NButton, NIcon } from "naive-ui";
import { Pencil } from "@vicons/ionicons5";
import { SaveOutlined, DeleteOutlined, AddTwotone } from "@vicons/material";
import { mapMutations } from "vuex";
export default {
  name: "OperationButtons",
  props: {
    record: {
      type: Object,
    },
  },
  methods: {
    ...mapMutations("asset", ["edit", "create"]),
  },
  components: {
    NSpace,
    NButton,
    Pencil,
    NIcon,
    DeleteOutlined,
    SaveOutlined,
    AddTwotone,
  },
};
</script>
