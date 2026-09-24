<template>
  <footer id="footer">
    <n-flex :size="4" class="text" align="center" vertical>
      <n-p depth="3">
        <n-text depth="3" @click="jumpLink(linkData.github)">
          SiteStatus
        </n-text>
        Version {{ version }}
      </n-p>
      <n-p depth="3">
        {{ $t("footer.basedOn") }}
        <n-text depth="3" @click="jumpLink('https://uptimerobot.com/')">
          {{ $t("uptimeRobot") }}
        </n-text>
        {{ $t("footer.interface") }} |
        {{ $t("footer.checkFrequency") }}
        {{ $t("footer.fiveMinutes") }}
      </n-p>
      <n-p depth="3">
        Copyright &copy; 2020 - {{ new Date().getFullYear() }}
        <n-text depth="3" @click="jumpLink(linkData.home)"> IMSYY </n-text>
        <n-text
          v-if="siteIcp"
          depth="3"
          @click="jumpLink('https://beian.miit.gov.cn/')"
        >
          | {{ siteIcp }}
        </n-text>
      </n-p>
    </n-flex>
  </footer>
</template>

<script setup lang="ts">
const { public: configPublic } = useRuntimeConfig();
const { siteIcp, version } = configPublic;

const linkData = {
  github: "https://github.com/imsyy/site-status",
  home: "https://www.imsyy.top",
};
</script>

<style lang="scss" scoped>
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px 90px;
  margin-top: auto;
  z-index: 100;
  .text {
    .n-p,
    .n-text {
      margin: 0;
      font-size: 13px;
      line-height: 26px;
    }
    .n-text {
      font-weight: bold;
      cursor: pointer;
      &:hover {
        color: var(--normal-color);
      }
    }
  }
}
</style>
