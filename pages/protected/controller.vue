<script lang="ts" setup>
import { useSupabaseClient, useSupabaseUser } from "#imports";
import { IThemeSettingOptions } from "~/utils/theme";

interface Mirror {
  number: number;
  isSelected: boolean;
  pan: number | undefined;
  tilt: number | undefined;
}

interface MirrorMovement {
  number: number;
  pan: number;
  tilt: number;
}

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const client = useSupabaseClient();
const mirrorLatestMovement = ref<MirrorMovement[] | null>(null);
const themeSetting = useState<IThemeSettingOptions>("theme.setting");

const initializeMirrorMovement = () => {
  const initialMirrorMovement = [...Array(689)].map((_, i) => {
    return {
      number: i + 1,
      pan: 0,
      tilt: 0,
    };
  });
  mirrorLatestMovement.value = initialMirrorMovement;
};

const getMirrorLatestMovement = async () => {
  const { data, error } = await client
    .from("Mirrors")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) {
    console.error(error);
    return;
  }
  if (data.length === 0) {
    initializeMirrorMovement();
    return;
  }
  // @ts-expect-error
  const topLeftMovement = data[0].top_left;
  // @ts-expect-error
  const leftMostMovement = data[0].left_most;
  // @ts-expect-error
  const rightMostMovement = data[0].right_most;
  // @ts-expect-error
  const topRightMovement = data[0].top_right;
  // @ts-expect-error
  const bottomLeftMovement = data[0].bottom_left;
  // @ts-expect-error
  const bottomRightMovement = data[0].bottom_right;
  mirrorLatestMovement.value = [
    ...topLeftMovement,
    ...leftMostMovement,
    ...rightMostMovement,
    ...topRightMovement,
    ...bottomLeftMovement,
    ...bottomRightMovement,
  ];
};

useAsyncData(async () => {
  await getMirrorLatestMovement();
  await getDashboardLastestSelection();
});

const topLeftMirrors = ref<Mirror[]>([]);
const leftMostMirrors = ref<Mirror[]>([]);
const rightMostMirrors = ref<Mirror[]>([]);
const topRightMirrors = ref<Mirror[]>([]);
const bottomLeftMirrors = ref<Mirror[]>([]);
const bottomRightMirrors = ref<Mirror[]>([]);
const selections = ref<number[]>([]);

const getDashboardLastestSelection = async () => {
  const { data, error } = await client
    .from("DashboardSelection")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) {
    console.error(error);
    return;
  }
  // @ts-expect-error
  const _selections = data[0].mirror_selection;
  selections.value = _selections;
  const _topLeftMirrors = createPanelWithMirrorSelection(1, 49);
  topLeftMirrors.value = _topLeftMirrors;
  const _leftMostMirrors = createPanelWithMirrorSelection(49, 193);
  leftMostMirrors.value = _leftMostMirrors;
  const _rightMostMirrors = createPanelWithMirrorSelection(193, 295);
  rightMostMirrors.value = _rightMostMirrors;
  const _topRightMirrors = createPanelWithMirrorSelection(295, 359);
  topRightMirrors.value = _topRightMirrors;
  const _bottomLeftMirrors = createPanelWithMirrorSelection(359, 519);
  bottomLeftMirrors.value = _bottomLeftMirrors;
  const _bottomRightMirrors = createPanelWithMirrorSelection(519, 689);
  bottomRightMirrors.value = _bottomRightMirrors;
};

const createPanelWithMirrorSelection = (start: number, end: number) => {
  const _formattedMirrors: Mirror[] = [];
  for (let i = start; i < end; i++) {
    const _mirror = {
      number: i,
      isSelected: selections.value.includes(i),
      pan: mirrorLatestMovement.value?.[i - 1].pan,
      tilt: mirrorLatestMovement.value?.[i - 1].tilt,
    };
    _formattedMirrors.push(_mirror);
  }
  return _formattedMirrors;
};

const updateMirrorState = {
  "update-mirror-state": (newVal: any) => {
    const top_left_newVal = newVal.top_left;
    for (let i = 0; i < top_left_newVal.length; i++) {
      const _mirror = top_left_newVal[i]; 
      topLeftMirrors.value[i].pan = _mirror.pan;
      topLeftMirrors.value[i].tilt = _mirror.tilt;
    }
    const left_most_newVal = newVal.left_most;
    for (let i = 0; i < left_most_newVal.length; i++) {
      const _mirror = left_most_newVal[i]; 
      leftMostMirrors.value[i].pan = _mirror.pan;
      leftMostMirrors.value[i].tilt = _mirror.tilt;
    }
    const right_most_newVal = newVal.right_most;
    for (let i = 0; i < right_most_newVal.length; i++) {
      const _mirror = right_most_newVal[i]; 
      rightMostMirrors.value[i].pan = _mirror.pan;
      rightMostMirrors.value[i].tilt = _mirror.tilt;
    }
    const top_right_newVal = newVal.top_right;
    for (let i = 0; i < top_right_newVal.length; i++) {
      const _mirror = top_right_newVal[i]; 
      topRightMirrors.value[i].pan = _mirror.pan;
      topRightMirrors.value[i].tilt = _mirror.tilt;
    }
    const bottom_left_newVal = newVal.bottom_left;
    for (let i = 0; i < bottom_left_newVal.length; i++) {
      const _mirror = bottom_left_newVal[i]; 
      bottomLeftMirrors.value[i].pan = _mirror.pan;
      bottomLeftMirrors.value[i].tilt = _mirror.tilt;
    }
    const bottom_right_newVal = newVal.bottom_right;
    for (let i = 0; i < bottom_right_newVal.length; i++) {
      const _mirror = bottom_right_newVal[i]; 
      bottomRightMirrors.value[i].pan = _mirror.pan;
      bottomRightMirrors.value[i].tilt = _mirror.tilt;
    }
  },
};

const formatToolTipData = (data: any) => {
  return `
    <div class="flex flex-row justify-between">
      <div class="text-sm font-medium text-gray-900">P: ${data.pan}</div>
      <div class="text-sm font-medium text-gray-900 ml-2">T: ${data.tilt}</div>
    </div>
  `;
};
</script>
<template>
  <PageWrapper>
    <PageBody>
      <PageSection>
        <div v-if="selections.length > 0">
          <div class="system-wrapper">
            <!-- top left -->
            <div class="wrapper panel-1">
              <div class="top-left">
                <div
                  v-for="mirror in topLeftMirrors"
                  :class="
                    mirror.isSelected
                      ? 'drag-select-option--selected'
                      : 'drag-select-option'
                  "
                  v-tippy="{
                    content: formatToolTipData(mirror),
                    placement: 'top',
                    arrow: true,
                    theme: themeSetting === 'dark' ? 'dark' : 'light',
                  }"
                >
                  {{ mirror.number }}
                </div>
              </div>
            </div>
            <!-- left most -->
            <div class="wrapper panel-2">
              <div class="left-most">
                <div
                  v-for="mirror in leftMostMirrors"
                  :class="
                    mirror.isSelected
                      ? 'drag-select-option--selected'
                      : 'drag-select-option'
                  "
                  v-tippy="{
                    content: formatToolTipData(mirror),
                    placement: 'top',
                    arrow: true,
                    theme: themeSetting === 'dark' ? 'dark' : 'light',
                  }"
                >
                  {{ mirror.number }}
                </div>
              </div>
            </div>
            <!-- right most -->
            <div class="wrapper panel-3">
              <div class="right-most">
                <div
                  v-for="mirror in rightMostMirrors"
                  :class="
                    mirror.isSelected
                      ? 'drag-select-option--selected'
                      : 'drag-select-option'
                  "
                  v-tippy="{
                    content: formatToolTipData(mirror),
                    placement: 'top',
                    arrow: true,
                    theme: themeSetting === 'dark' ? 'dark' : 'light',
                  }"
                >
                  {{ mirror.number }}
                </div>
              </div>
            </div>
            <!-- top right -->
            <div class="wrapper panel-4">
              <div class="top-right">
                <div
                  v-for="mirror in topRightMirrors"
                  :class="
                    mirror.isSelected
                      ? 'drag-select-option--selected'
                      : 'drag-select-option'
                  "
                  v-tippy="{
                    content: formatToolTipData(mirror),
                    placement: 'top',
                    arrow: true,
                    theme: themeSetting === 'dark' ? 'dark' : 'light',
                  }"
                >
                  {{ mirror.number }}
                </div>
              </div>
            </div>
            <!-- bottom left -->
            <div class="wrapper panel-5">
              <div class="bottom-left">
                <div
                  v-for="mirror in bottomLeftMirrors"
                  :class="
                    mirror.isSelected
                      ? 'drag-select-option--selected'
                      : 'drag-select-option'
                  "
                  v-tippy="{
                    content: formatToolTipData(mirror),
                    placement: 'top',
                    arrow: true,
                    theme: themeSetting === 'dark' ? 'dark' : 'light',
                  }"
                >
                  {{ mirror.number }}
                </div>
              </div>
            </div>
            <div class="hidden panel-6"></div>
            <div class="hidden panel-7"></div>
            <!-- bottom right -->
            <div class="wrapper panel-8">
              <div class="bottom-right">
                <div
                  v-for="mirror in bottomRightMirrors"
                  :class="
                    mirror.isSelected
                      ? 'drag-select-option--selected'
                      : 'drag-select-option'
                  "
                  v-tippy="{
                    content: formatToolTipData(mirror),
                    placement: 'top',
                    arrow: true,
                    theme: themeSetting === 'dark' ? 'dark' : 'light',
                  }"
                >
                  {{ mirror.number }}
                </div>
              </div>
            </div>
          </div>
          <ControllerMirrorController
            :selectedMirrors="selections"
            v-on="updateMirrorState"
          />
        </div>
        <div v-else class="flex justify-center">
          <div
            class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-red-600">
              No Mirrors Found
            </h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-white">
              Please select a mirror to control. You can select a mirror or a
              group of mirrors in Dashboard
            </p>
            <a
              @click.prevent="$router.push('/protected/dashboard')"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Go to Dashboard
              <svg
                aria-hidden="true"
                class="w-4 h-4 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>

<style scoped lang="scss">
.system-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 1rem;
}

.wrapper {
  position: relative;
  border: 1px solid #086f5a;
  overflow: auto;
  height: max-content;
}

.top-left {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(6, 1fr);
}

.left-most {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: repeat(6, 1fr);
}

.right-most {
  display: grid;
  grid-template-columns: repeat(17, 1fr);
  grid-template-rows: repeat(6, 1fr);
}

.top-right {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(6, 1fr);
}

.bottom-left {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: repeat(10, 1fr);
}

.bottom-right {
  display: grid;
  grid-template-columns: repeat(17, 1fr);
  grid-template-rows: repeat(10, 1fr);
}

.panel-8 {
  grid-column: 4 / 5;
  grid-row: 2 / 3;
}

.drag-select-option {
  height: 2.5rem;
  margin: 0.5rem;
  color: #ffffff;
  background: #e37e26;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drag-select-option--selected {
  height: 2.5rem;
  margin: 0.5rem;
  color: #000000;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #10ccc3;
}
</style>
