<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- オーバーレイ -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50"
          @click="$emit('update:modelValue', false)"
        ></div>

        <!-- モーダルコンテンツ -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <transition
            enter-active-class="transition-all duration-300"
            leave-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="modelValue"
              class="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              @click.stop
            >
              <!-- ヘッダー -->
              <div class="border-b px-6 py-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900">
                    <slot name="header">{{ title }}</slot>
                  </h3>
                  <button
                    @click="$emit('update:modelValue', false)"
                    class="text-gray-400 hover:text-gray-500"
                  >
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- ボディ -->
              <div class="px-6 py-4">
                <slot></slot>
              </div>

              <!-- フッター -->
              <div v-if="$slots.footer" class="border-t px-6 py-4">
                <slot name="footer"></slot>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>