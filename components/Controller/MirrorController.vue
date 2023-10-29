<template>
  <div class="flex flex-col w-full xs:w-9/12">
    <DataTable
      stripedRows
      :value="controllerValue"
      editMode="cell"
      @cell-edit-complete="onUpdateTableValue"
      tableClass="editable-cells-table"
      class="w-full"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl text-gray-900 dark:text-white font-bold"
            >Mirror Controller</span
          >
          <div class="flex-1"></div>
          <Button
            icon="pi pi-refresh"
            rounded
            raised
            @click="resetSelectedMirrors"
          />
          <Button
            icon="pi pi-save"
            rounded
            raised
            @click="saveChangesSelectedMirrors"
          />
        </div>
      </template>
      <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        style="width: 50%"
      >
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" class="w-full" :key="field" />
        </template>
      </Column>
    </DataTable>
    <div class="flex-1"></div>
    <div class="flex flex-row items-center justify-center">
      <Dpad class="p-4" v-on="dpadUpdate" />
    </div>
    <Dialog v-model:visible="visible" modal>
      <template #header>
        <div v-if="isError" class="text-red-500 uppercase">Error</div>
        <div v-if="isSuccess" class="text-green-500 uppercase">Success</div>
      </template>
      <template #default>
        <div v-if="isError" class="text-red-500">
          {{ errorMessage }}
        </div>
        <div v-if="isSuccess" class="text-green-500">
          Changes were saved successfully! Hover over the mirror to see the
          changes.
        </div>
      </template>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import _ from "lodash";
import { PropType } from "vue";

interface MirrorState {
  pan: string;
  tilt: string;
}

interface Mirror {
  number: number;
  pan: number;
  tilt: number;
}

interface Response {
  id: number;
  created_at: string;
  top_left: Mirror[];
  left_most: Mirror[];
  right_most: Mirror[];
  top_right: Mirror[];
  bottom_left: Mirror[];
  bottom_right: Mirror[];
  user_id: string;
}

const props = defineProps({
  selectedMirrors: {
    type: Array as PropType<number[]>,
    required: true,
  },
});

const _selectedMirrors = toRef(props, "selectedMirrors");
const controllerValue = ref<MirrorState[]>([
  {
    pan: "0",
    tilt: "0",
  },
]);
const columns = ref([
  { field: "pan", header: "Pan" },
  { field: "tilt", header: "Tilt" },
]);

const initPanel = (start: number, end: number) => {
  const _panel = [];
  for (let i = start; i <= end; i++) {
    _panel.push({
      number: i,
      pan: 0,
      tilt: 0,
    });
  }
  return _panel;
};

const latestState = ref({
  top_left: initPanel(1, 49),
  left_most: initPanel(49, 193),
  right_most: initPanel(193, 295),
  top_right: initPanel(295, 359),
  bottom_left: initPanel(359, 519),
  bottom_right: initPanel(519, 689),
});

const visible = ref(false);
const isError = ref(false);
const errorMessage = ref("");
const isSuccess = ref(false);

const emit = defineEmits(["update-mirror-state"]);

const client = useSupabaseClient();
const auth = useSupabaseUser();

const getData = async () => {
  const { data, error } = await client
    .from("Mirrors")
    .select("*")
    .order("id", { ascending: false })
    .limit(1);
  if (error) {
    console.error(error);
    return;
  }
  if (data.length === 0) return;
  const latestData: Response = data[0];
  latestState.value.top_left = latestData.top_left;
  latestState.value.left_most = latestData.left_most;
  latestState.value.right_most = latestData.right_most;
  latestState.value.top_right = latestData.top_right;
  latestState.value.bottom_left = latestData.bottom_left;
  latestState.value.bottom_right = latestData.bottom_right;
};

await useAsyncData(getData);

const onUpdateTableValue = (event: any) => {
  const { newData } = event;
  const arrayFormatedNewValue = [
    {
      pan: newData.pan,
      tilt: newData.tilt,
    },
  ];
  controllerValue.value = arrayFormatedNewValue;
};

const formatInsertPayload = (mirrors: any) => {
  const user_id = auth.value?.id;
  return {
    user_id,
    ...mirrors,
  };
};

const resetSelectedMirrors = async () => {
  const resetMirrors = {
    top_left: initPanel(1, 49),
    left_most: initPanel(49, 193),
    right_most: initPanel(193, 295),
    top_right: initPanel(295, 359),
    bottom_left: initPanel(359, 519),
    bottom_right: initPanel(519, 689),
  };
  const { error } = await client
    .from("Mirrors")
    .insert(formatInsertPayload(resetMirrors));
  if (error) {
    console.error(error);
    return;
  }
  latestState.value = resetMirrors;
  resetModalState();
  visible.value = true;
  isSuccess.value = true;
  isError.value = false;
  emit("update-mirror-state", latestState.value);
};

const updateMirrorPanels = () => {
  const _selectedVal = _selectedMirrors.value;
  const currentControllerVal = controllerValue.value[0];
  const currentSystemData = latestState.value;
  _selectedVal.forEach((val) => {
    if (val >= 1 && val < 49) {
      currentSystemData.top_left[val - 1].pan = parseInt(
        currentControllerVal.pan
      );
      currentSystemData.top_left[val - 1].tilt = parseInt(
        currentControllerVal.tilt
      );
    } else if (val >= 49 && val < 193) {
      currentSystemData.left_most[val - 49].pan = parseInt(
        currentControllerVal.pan
      );
      currentSystemData.left_most[val - 49].tilt = parseInt(
        currentControllerVal.tilt
      );
    } else if (val >= 193 && val < 295) {
      currentSystemData.right_most[val - 193].pan = parseInt(
        currentControllerVal.pan
      );
      currentSystemData.right_most[val - 193].tilt = parseInt(
        currentControllerVal.tilt
      );
    } else if (val >= 295 && val < 359) {
      currentSystemData.top_right[val - 295].pan = parseInt(
        currentControllerVal.pan
      );
      currentSystemData.top_right[val - 295].tilt = parseInt(
        currentControllerVal.tilt
      );
    } else if (val >= 359 && val < 519) {
      currentSystemData.bottom_left[val - 359].pan = parseInt(
        currentControllerVal.pan
      );
      currentSystemData.bottom_left[val - 359].tilt = parseInt(
        currentControllerVal.tilt
      );
    } else if (val >= 519 && val < 689) {
      currentSystemData.bottom_right[val - 519].pan = parseInt(
        currentControllerVal.pan
      );
      currentSystemData.bottom_right[val - 519].tilt = parseInt(
        currentControllerVal.tilt
      );
    }
  });
  latestState.value = currentSystemData;
};

const resetModalState = () => {
  visible.value = false;
  isError.value = false;
  isSuccess.value = false;
  errorMessage.value = "";
};

const saveChangesSelectedMirrors = async () => {
  if (_selectedMirrors.value.length === 0) {
    resetModalState();
    isError.value = true;
    visible.value = true;
    errorMessage.value = "Please select at least a mirror.";
    return;
  }
  const _controllerValue = controllerValue.value[0];
  if (_controllerValue.pan === "" || _controllerValue.tilt === "") {
    resetModalState();
    isError.value = true;
    visible.value = true;
    errorMessage.value = "Please enter a value for both pan and tilt.";
    return;
  }
  updateMirrorPanels();
  const { error } = await client
    .from("Mirrors")
    .insert(formatInsertPayload(latestState.value));
  if (error) {
    console.error(error);
    return;
  }
  await getData();
  resetModalState();
  isSuccess.value = true;
  visible.value = true;
  emit("update-mirror-state", latestState.value);
};

const updateMirrorPanelsFromDpad = (direction: string) => {
  const _selectedVal = _selectedMirrors.value;
  if (direction === "up") {
    _selectedVal.forEach((val) => {
      if (val >= 1 && val < 49) {
        latestState.value.top_left[val - 1].tilt += 1;
      }
    });
  } else if (direction === "down") {
    _selectedVal.forEach((val) => {
      if (val >= 1 && val < 49) {
        latestState.value.top_left[val - 1].tilt -= 1;
      }
    });
  } else if (direction === "left") {
    _selectedVal.forEach((val) => {
      if (val >= 1 && val < 49) {
        latestState.value.top_left[val - 1].pan -= 1;
      }
    });
  } else if (direction === "right") {
    _selectedVal.forEach((val) => {
      if (val >= 1 && val < 49) {
        latestState.value.top_left[val - 1].pan += 1;
      }
    });
  }
};

const dpadUpdate = {
  up: async () => {
    if (_selectedMirrors.value.length === 0) {
      resetModalState();
      isError.value = true;
      visible.value = true;
      errorMessage.value = "Please select at least a mirror.";
      return;
    }
    updateMirrorPanelsFromDpad("up");
    const { error } = await client
      .from("Mirrors")
      .insert(formatInsertPayload(latestState.value));
    if (error) {
      console.error(error);
      return;
    }
    await getData();
    resetModalState();
    isSuccess.value = true;
    visible.value = true;
    emit("update-mirror-state", latestState.value);
  },
  down: async () => {
    if (_selectedMirrors.value.length === 0) {
      resetModalState();
      isError.value = true;
      visible.value = true;
      errorMessage.value = "Please select at least a mirror.";
      return;
    }
    updateMirrorPanelsFromDpad("down");
    const { error } = await client
      .from("Mirrors")
      .insert(formatInsertPayload(latestState.value));
    if (error) {
      console.error(error);
      return;
    }
    await getData();
    resetModalState();
    isSuccess.value = true;
    visible.value = true;
    emit("update-mirror-state", latestState.value);
  },
  left: async () => {
    if (_selectedMirrors.value.length === 0) {
      resetModalState();
      isError.value = true;
      visible.value = true;
      errorMessage.value = "Please select at least a mirror.";
      return;
    }
    updateMirrorPanelsFromDpad("left");
    const { error } = await client
      .from("Mirrors")
      .insert(formatInsertPayload(latestState.value));
    if (error) {
      console.error(error);
      return;
    }
    await getData();
    resetModalState();
    isSuccess.value = true;
    visible.value = true;
    emit("update-mirror-state", latestState.value);
  },
  right: async () => {
    if (_selectedMirrors.value.length === 0) {
      resetModalState();
      isError.value = true;
      visible.value = true;
      errorMessage.value = "Please select at least a mirror.";
      return;
    }
    updateMirrorPanelsFromDpad("right");
    const { error } = await client
      .from("Mirrors")
      .insert(formatInsertPayload(latestState.value));
    if (error) {
      console.error(error);
      return;
    }
    await getData();
    resetModalState();
    isSuccess.value = true;
    visible.value = true;
    emit("update-mirror-state", latestState.value);
  },
};
</script>
