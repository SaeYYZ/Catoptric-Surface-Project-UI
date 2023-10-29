<script lang="ts" setup>

export interface ISidebarItem {
	to: any,
	text: string,
}

const props = defineProps({
	mode: {
		type: String,
		default: 'normal'
	}
})
const sidebar = ref(null)
const mode = toRef(props, 'mode')
const route = useRoute()
const currentRoute = computed(() => route.name?.valueOf())
const sidebarItems = computed((): ISidebarItem[] => [
	{
		to: { name: 'dashboard' },
		text: 'Dashboard'
	},
	{
		to: { name: 'controller' },
		text: 'Controller'
	},
	{
		to: { name: 'prototype'},
		text: 'Prototype'
	}
])
</script>
<template>
	<div
		ref="sidebar"
		:class="{
			// this is changed, originally 60 - 80
			'fixed top-0 hidden pt-12 lg:flex lg:w-40 xl:w-60 h-screen': mode === 'normal',
			'relative flex-1 flex flex-col w-full': mode === 'mobile',
		}"
		>
		<div class="flex-1 overflow-y-auto pl-4 lg:pl-0 pr-4 py-4 border-r-1 border-gray-900/10 dark:border-gray-50/[0.2]">
			<ul class="px-3">
				<li v-for="item in sidebarItems" :key="item.text">
					<Anchor :to="item.to.name" :text="item.text" class="group flex items-center mb-4 hover:no-underline">
						<div 
							class="flex items-center mr-4 px-2 py-2 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 dark:ring-0 dark:shadow-none dark:group-hover:shadow-none dark:group-hover:highlight-white/10 group-hover:shadow-sky-200 dark:highlight-white/10"
							:class="{
								'text-white dark:text-white group-hover:bg-sky-500 bg-sky-500':
									item.to.name === currentRoute,
								'text-slate-500 dark:text-gray-100 group-hover:bg-gray-200 bg-gray-100 drak:group-hover:bg-slate-600 dark:bg-slate-700':
									item.to.name !== currentRoute,
							}"
						>
							<IconUil:apps class="text-base" v-if="item.to.name === 'dashboard'"/>
							<IconUil:server class="text-base" v-if="item.to.name === 'controller'"/>
							<IconIcon-park-solid:experiment class="text-base" v-if="item.to.name === 'prototype'"/>
						</div>
						<span 
							class="text-base font-semibold capitalize"
							:class="{
								'font-extrabold text-sky-500 dark:text-sky-400' : item.to.name === currentRoute,
							}"
						>
							{{ item.text }}
						</span>
					</Anchor>
				</li>
			</ul>
		</div>
	</div>
</template>