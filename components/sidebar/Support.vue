<template>
  <div class="bg-primary-linear relative bg-gradient-to-r from-primary-linear to-secondary-linear rounded-xl p-6 w-full h-56">
    <div class="flex flex-col gap-2">
      <span class="text-small text-white font-normal">
        <Icon name="Support" :stroke-width="1.75" :size="20" class="text-white" />
        Support 24/7
      </span>
      <Button class="w-fit bg-white duration-200 hover:text-white hover:bg-primary-linear text-primary-linear font-semibold rounded-xl px-4 py-2">
        <span class="text-xsmall">Contact</span>
      </Button>
    </div>
    <div class="flex absolute bottom-0 right-0 justify-center items-center bg-[#a658fa] rounded-full w-32 h-32">
      <img class="w-24 p-2 h-auto" src="~/assets/img/support_img.png" alt="Image support">
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style></style>