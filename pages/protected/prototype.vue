<template>
  <PageWrapper>
    <PageHeader class="h-1/12 transition duration-500 ease-in-out">
      <PageTitle
        text="Prototype of the system"
        class="uppercase flex justify-center"
      />
    </PageHeader>
    <PageBody class="h-10/12 transition duration-500 ease-in-out">
      <PageSection
        class="flex flex-col h-5/12 mx-auto max-w-md"
        style="min-height: 10rem"
      >
        <div
          class="w-full bg-wood border border-wood-dark shadow-md p-2 flex-1"
          style="max-height: 1rem"
        ></div>
        <div class="flex flex-row flex-1">
          <div class="bg-wood border border-wood-dark shadow-md p-2"></div>
          <div class="flex flex-col justify-between w-1/12">
            <div class="flex-1"></div>
            <div
              class="h-4 bg-wood border border-wood-dark shadow-md p-2"
            ></div>
            <div class="flex-1"></div>
            <div class="h-4 bg-wood border border-wood-dark shadow-md"></div>
            <div class="flex-1"></div>
          </div>
          <div class="flex flex-col w-4/12 md:w-3/12">
            <div class="flex-1"></div>
            <button
              ref="topLeft"
              id="topLeft"
              type="button"
              class="rounded-md dark:bg-zinc-400 bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 h-2/6 !border-none"
              @click.prevent="registerMirror"
              v-tippy="{
                content: formatToolTipData(topLeftData),
                placement: 'right-start',
                arrow: true,
                theme: themeSetting === 'dark' ? 'dark' : 'light',
              }"
            />
            <div class="flex-1"></div>
            <button
              ref="bottomLeft"
              id="bottomLeft"
              type="button"
              class="rounded-md dark:bg-zinc-400 bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 h-2/6"
              @click.prevent="registerMirror"
              v-tippy="{
                content: formatToolTipData(bottomLeftData),
                placement: 'right-start',
                arrow: true,
                theme: themeSetting === 'dark' ? 'dark' : 'light',
              }"
            ></button>
            <div class="flex-1"></div>
          </div>
          <div class="flex flex-col justify-between w-3/12 md:w-4/12">
            <div class="flex-1"></div>
            <div class="h-4 bg-wood border border-wood-dark shadow-md"></div>
            <div class="flex-1"></div>
            <div class="h-4 bg-wood border border-wood-dark shadow-md"></div>
            <div class="flex-1"></div>
          </div>
          <div class="flex flex-col w-4/12 md:w-3/12">
            <div class="flex-1"></div>
            <button
              ref="topRight"
              id="topRight"
              type="button"
              class="rounded-md dark:bg-zinc-400 bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 h-2/6"
              @click.prevent="registerMirror"
              v-tippy="{
                content: formatToolTipData(topRightData),
                placement: 'right-start',
                arrow: true,
                theme: themeSetting === 'dark' ? 'dark' : 'light',
              }"
            ></button>
            <div class="flex-1"></div>
            <button
              ref="bottomRight"
              id="bottomRight"
              type="button"
              class="rounded-md dark:bg-zinc-400 bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 h-2/6"
              @click.prevent="registerMirror"
              v-tippy="{
                content: formatToolTipData(bottomRightData),
                placement: 'right-start',
                arrow: true,
                theme: themeSetting === 'dark' ? 'dark' : 'light',
              }"
            ></button>
            <div class="flex-1"></div>
          </div>
          <div class="flex flex-col justify-between w-1/12">
            <div class="flex-1"></div>
            <div class="h-4 bg-wood border border-wood-dark shadow-md"></div>
            <div class="flex-1"></div>
            <div class="h-4 bg-wood border border-wood-dark shadow-md"></div>
            <div class="flex-1"></div>
          </div>
          <div
            class="h-fit bg-wood border border-wood-dark shadow-md p-2"
          ></div>
        </div>
      </PageSection>
      <PageSection class="flex justify-center h-5/12">
        <PrototypeMirrorController
          :selectedMirrors="selectedMirrors"
          v-on="updateMirrorsState"
        />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
<script lang="ts" setup>
import { IThemeSettingOptions } from "~/utils/theme";

interface MirrorData {
  pan: number;
  tilt: number;
}

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const topLeft = ref<HTMLButtonElement | null>(null);
const bottomLeft = ref<HTMLButtonElement | null>(null);
const topRight = ref<HTMLButtonElement | null>(null);
const bottomRight = ref<HTMLButtonElement | null>(null);
const selectedMirrors = reactive<string[]>([]);
const themeSetting = useState<IThemeSettingOptions>("theme.setting");
const topLeftData = reactive<MirrorData>({
  pan: 0,
  tilt: 0,
});
const bottomLeftData = reactive<MirrorData>({
  pan: 0,
  tilt: 0,
});
const topRightData = reactive<MirrorData>({
  pan: 0,
  tilt: 0,
});
const bottomRightData = reactive<MirrorData>({
  pan: 0,
  tilt: 0,
});

const client = useSupabaseClient();

const registerMirror = (e: any) => {
  const mirrorId = e.target.id;
  if (selectedMirrors.includes(mirrorId)) {
    selectedMirrors.splice(selectedMirrors.indexOf(mirrorId), 1);
  } else {
    selectedMirrors.push(mirrorId);
  }
};

const updateMirrorsState = {
  "update-mirror-state": (stateUpdates: any) => {
    for (const [key, value] of Object.entries(stateUpdates)) {
      if (key === "top_left") {
        // @ts-expect-error
        topLeftData.pan = value.pan;
        // @ts-expect-error
        topLeftData.tilt = value.tilt;
      } else if (key === "bottom_left") {
        // @ts-expect-error
        bottomLeftData.pan = value.pan;
        // @ts-expect-error
        bottomLeftData.tilt = value.tilt;
      } else if (key === "top_right") {
        // @ts-expect-error
        topRightData.pan = value.pan;
        // @ts-expect-error
        topRightData.tilt = value.tilt;
      } else if (key === "bottom_right") {
        // @ts-expect-error
        bottomRightData.pan = value.pan;
        // @ts-expect-error
        bottomRightData.tilt = value.tilt;
      }
    }
  },
};

await useAsyncData(async () => {
  const { data, error } = await client
    .from("Prototype")
    .select("*")
    .order("id", { ascending: false })
    .limit(1);
  if (error) {
    console.error(error);
    return;
  }
  if (data.length === 0) return;
  const _data: any = data[0];
  delete _data.id;
  delete _data.created_at;
  delete _data.user_id;
  if (_data.top_left) {
    topLeftData.pan = _data.top_left.pan;
    topLeftData.tilt = _data.top_left.tilt;
  }
  if (_data.bottom_left) {
    bottomLeftData.pan = _data.bottom_left.pan;
    bottomLeftData.tilt = _data.bottom_left.tilt;
  }
  if (_data.top_right) {
    topRightData.pan = _data.top_right.pan;
    topRightData.tilt = _data.top_right.tilt;
  }
  if (_data.bottom_right) {
    bottomRightData.pan = _data.bottom_right.pan;
    bottomRightData.tilt = _data.bottom_right.tilt;
  }
});

const formatToolTipData = (data: any) => {
  return `
    <div class="flex flex-row justify-between">
      <div class="text-sm font-medium text-gray-900">P: ${data.pan}</div>
      <div class="text-sm font-medium text-gray-900 ml-2">T: ${data.tilt}</div>
    </div>
  `;
};

watch(selectedMirrors, (newVal) => {
  const topLeftVal = topLeft.value;
  const bottomLeftVal = bottomLeft.value;
  const topRightVal = topRight.value;
  const bottomRightVal = bottomRight.value;
  if (themeSetting.value === "light") {
    if (topLeftVal && topLeftVal.classList.contains("bg-teal-400")) {
      topLeftVal.classList.remove("bg-teal-400");
    }
    if (bottomLeftVal && bottomLeftVal.classList.contains("bg-teal-400")) {
      bottomLeftVal.classList.remove("bg-teal-400");
    }
    if (topRightVal && topRightVal.classList.contains("bg-teal-400")) {
      topRightVal.classList.remove("bg-teal-400");
    }
    if (bottomRightVal && bottomRightVal.classList.contains("bg-teal-400")) {
      bottomRightVal.classList.remove("bg-teal-400");
    }
    if (topLeftVal && newVal.includes("topLeft")) {
      topLeftVal.classList.add("bg-teal-400");
    }
    if (bottomLeftVal && newVal.includes("bottomLeft")) {
      bottomLeftVal.classList.add("bg-teal-400");
    }
    if (topRightVal && newVal.includes("topRight")) {
      topRightVal.classList.add("bg-teal-400");
    }
    if (bottomRightVal && newVal.includes("bottomRight")) {
      bottomRightVal.classList.add("bg-teal-400");
    }
  } else {
    if (topLeftVal && topLeftVal.classList.contains("dark:bg-teal-400")) {
      topLeftVal.classList.remove("dark:bg-teal-400");
    }
    if (bottomLeftVal && bottomLeftVal.classList.contains("dark:bg-teal-400")) {
      bottomLeftVal.classList.remove("dark:bg-teal-400");
    }
    if (topRightVal && topRightVal.classList.contains("dark:bg-teal-400")) {
      topRightVal.classList.remove("dark:bg-teal-400");
    }
    if (
      bottomRightVal &&
      bottomRightVal.classList.contains("dark:bg-teal-400")
    ) {
      bottomRightVal.classList.remove("dark:bg-teal-400");
    }
    if (topLeftVal && newVal.includes("topLeft")) {
      topLeftVal.classList.add("dark:bg-teal-400");
    }
    if (bottomLeftVal && newVal.includes("bottomLeft")) {
      bottomLeftVal?.classList.add("dark:bg-teal-400");
    }
    if (topRightVal && newVal.includes("topRight")) {
      topRightVal.classList.add("dark:bg-teal-400");
    }
    if (bottomRightVal && newVal.includes("bottomRight")) {
      bottomRightVal.classList.add("dark:bg-teal-400");
    }
  }
});
</script>
<style>
.tippy-box[data-theme~="light"] {
  background-color: #fff;
  color: #000;
}
.tippy-box[data-theme~="dark"] {
  background-color: rgb(226 232 240);
  color: #000;
  border-radius: 10px;
  border: 1px solid #000;
}
.tippy-box[data-theme~="light"] .tippy-arrow {
  border-top-color: #fff;
}
.tippy-box[data-theme~="dark"] .tippy-arrow {
  border-top-color: rgb(226 232 240);
}
.tippy-box[data-theme~="light"] .tippy-content {
  padding: 10px;
}
.tippy-box[data-theme~="dark"] .tippy-content {
  padding: 10px;
}
</style>
