<template>
  <el-calendar v-model="value"> </el-calendar>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {
      value: new Date(),
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped></style>
