<script lang="ts" setup>
import { VueSelecto } from "vue3-selecto";
import {
  TransitionRoot,
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/vue";
import { PropType } from "vue";

interface IMirror {
  number: string;
  isSelected: boolean;
}

const props = defineProps({
  enabled: {
    type: Boolean,
    required: true,
  },
  selections: {
    type: Array as PropType<number[]>,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  cubes: {
    type: Array as PropType<IMirror[]>,
    required: true,
  },
});

const _enabled = toRef(props, "enabled");
const _id = toRef(props, "id");
const _cubes = toRef(props, "cubes");
const emit = defineEmits(["close", "confirm", "cancel"]);
const scroller = ref(null);
const selecto = ref<any>(null);
const scrollOptions = ref<any>(undefined);

const closeModal = () => {
  emit("close", false);
};
const confirmSelection = () => {
  emit("confirm", false);
};

const cancelSelection = () => {
  emit("cancel", false);
};

const _name = () => {
  const name = _id.value;
  const firstCapital = name.search(/[A-Z]/);
  const firstWord = name.slice(0, firstCapital);
  const firstWordCapitalized =
    firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
  const secondWord = name.slice(firstCapital);
  return firstWordCapitalized + " " + secondWord;
};

const onSelect = (e: any) => {
  e.added.forEach((el: HTMLElement) => {
    if (el.classList.contains("selected")) {
      return;
    }
    el.classList.add("selected");
    const value = el?.querySelector("span")?.textContent;
    if (value) {
      props.selections.push(parseInt(value));
    }
  });
  e.removed.forEach((el: HTMLElement) => {
    el.classList.remove("selected");
    const value = el?.querySelector("span")?.textContent;
    if (value) {
      const index = props.selections.indexOf(parseInt(value));
      if (index > -1) {
        props.selections.splice(index, 1);
      }
    }
  });
};

const onDragStart = (e: any) => {
  if (e.inputEvent.target.nodeName === "BUTTON") {
    return false;
  }
  return true;
};

const createGridById = () => {
  const id = _id.value;
  if (id === "topLeft") {
    return "grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(6, 1fr);";
  }
  if (id === "leftMost") {
    return "grid-template-columns: repeat(16, 1fr); grid-template-rows: repeat(6, 1fr);";
  }
  if (id === "rightMost") {
    return "grid-template-columns: repeat(17, 1fr); grid-template-rows: repeat(6, 1fr);";
  }
  if (id === "topRight") {
    return "grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr);";
  }
  if (id === "bottomLeft") {
    return "grid-template-columns: repeat(16, 1fr); grid-template-rows: repeat(10, 1fr);";
  }
  if (id === "bottomRight") {
    return "grid-template-columns: repeat(17, 1fr); grid-template-rows: repeat(10, 1fr);";
  }
};

// @ts-expect-error
const onScroll = ({ direction, container }) => {
  container.scrollBy({
    left: direction[0] * 10,
    top: direction[1] * 10,
  });
};

const onScrollerScroll = () => {
  if (!selecto.value) return;
  selecto.value.checkScroll();
};

onMounted(() => {
  const scrollOptions_ = {
    container: () => scroller.value,
    throttleTime: 20,
    checkScrollEvent: true,
  };
  scrollOptions.value = scrollOptions_;
});

</script>
<template>
  <TransitionRoot :show="_enabled" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="transition ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 overflow-y-auto overlow-x bg-black/30">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <VueSelecto
              ref="selecto"
              dragContainer=".elements"
              v-bind:selectableTargets="['.selecto-area .cube']"
              v-bind:hitRate="0"
              v-bind:selectByClick="true"
              v-bind:selectFromInside="true"
              v-bind:toggleContinueSelect="['shift']"
              v-bind:ratio="0"
              @dragStart="onDragStart"
              @select="onSelect"
              @scroll="onScroll"
              :scrollOptions="scrollOptions"
            />
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 sclae-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-lg transform overfow-x rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all my-10"
              >
                <DialogTitle
                  class="text-lg leading-6 font-medium text-gray-900 mt-4"
                >
                  {{ _name() }}
                  <button
                    type="button"
                    class="absolute top-0 right-0 mt-6 mr-6 text-red-600 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeModal"
                  >
                    X
                  </button>
                </DialogTitle>
                <div class="container">
                  <div
                    class="elements scroll selecto-area grid"
                    id="selecto1"
                    :style="createGridById()"
                    ref="scroller"
                    @scroll="onScrollerScroll"
                  >
                    <template v-for="cube in _cubes">
                      <div
                        class="cube selected"
                        v-if="cube.isSelected"
                      >
                        <span
                          class="flex justify-center flex-1 text-gray-800 p-2"
                          >{{ cube.number }}</span
                        >
                      </div>
                      <div class="cube" v-else>
                        <span
                          class="flex justify-center flex-1 text-gray-800 p-2"
                          >{{ cube.number }}</span
                        >
                      </div>
                    </template>
                  </div>
                  <div class="empty elements"></div>
                </div>
                <div class="flex flex-row mt-4 justify-end">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-sky-500 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="confirmSelection"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    class="inline-flex ml-4 justify-center rounded-md border border-transparent bg-rose-500 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="cancelSelection"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
<style scoped>
.container {
  max-width: 800px;
}

.cube {
  display: inline-block;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  margin: 4px;
  background: #eee;
  --color: #4af;
}

.elements {
  margin-top: 40px;
  border: 2px solid #eee;
}

.selecto-area {
  padding: 20px;
}

#selecto1 .cube {
  transition: all ease 0.2s;
}

.moveable #selecto1 .cube {
  transition: none;
}

.selecto-area .selected {
  color: #fff;
  background: var(--color);
}

.scroll {
  overflow: auto;
  padding-top: 10px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.scroll {
  width: 100%;
  height: 300px;
  box-sizing: border-box;
}

.empty.elements {
  border: none;
}
</style>
