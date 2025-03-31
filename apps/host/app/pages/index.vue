<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

useSeoMeta({
  titleTemplate: '',
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description
})

// 定义优化的动画效果 - 允许多次触发但避免闪烁
const fadeInUpAnimation = {
  initial: {
    opacity: 0,
    y: 100
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 800,
      ease: 'easeOut'
    }
  },
  // 离开视窗时透明度渐变，但不改变位置，避免闪烁
  leave: {
    opacity: 0,
    // 不改变 y 值，避免位置跳动
    transition: {
      duration: 500,
      ease: 'easeIn'
    }
  }
}

// 定义各部分的动画，添加不同的延迟
const aboutMotion = {
  ...fadeInUpAnimation,
  visible: {
    ...fadeInUpAnimation.visible,
    transition: {
      duration: 800,
      ease: 'easeOut'
    }
  }
}

const activitiesMotion = {
  ...fadeInUpAnimation,
  visible: {
    ...fadeInUpAnimation.visible,
    transition: {
      duration: 800,
      delay: 100,
      ease: 'easeOut'
    }
  }
}

const featuresMotion = {
  ...fadeInUpAnimation,
  visible: {
    ...fadeInUpAnimation.visible,
    transition: {
      duration: 800,
      delay: 200,
      ease: 'easeOut'
    }
  }
}

const departmentsMotion = {
  ...fadeInUpAnimation,
  visible: {
    ...fadeInUpAnimation.visible,
    transition: {
      duration: 800,
      delay: 300,
      ease: 'easeOut'
    }
  }
}

// 为每张卡片单独设置延迟
const cardMotions = (index: number) => ({
  ...fadeInUpAnimation,
  visible: {
    ...fadeInUpAnimation.visible,
    transition: {
      duration: 800,
      delay: 150 + index * 100,
      ease: 'easeOut'
    }
  }
})
</script>

<template>
  <div v-if="page">
    <UPageHero
      :title="'西南大学\n开源与网络安全协会'"
      :description="page.hero.description"
      :links="page.hero.links"
      :ui="{ title: 'whitespace-pre-line gap-2 leading-normal' }"
    >
      <template #top>
        <div class="absolute rounded-full dark:bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
        <LazyStarsBg />
      </template>
    </UPageHero>

    <UPageSection
      v-for="(section, index) in page.sections"
      :key="index"
      v-motion="index === 0 ? aboutMotion : activitiesMotion"
      :title="section.title"
      :description="section.description"
      :orientation="section.orientation"
      :reverse="section.reverse"
      :features="section.features"
      :motion-instance="{ threshold: 0.3, throttle: 300 }"
    >
      <ImagePlaceholder />
    </UPageSection>

    <UPageSection
      v-motion="featuresMotion"
      :title="page.features.title"
      :description="page.features.description"
      :motion-instance="{ threshold: 0.3, throttle: 300 }"
    >
      <UPageGrid>
        <UPageCard
          v-for="(item, index) in page.features.items"
          :key="index"
          v-bind="item"
          v-motion="cardMotions(index)"
          spotlight
          :motion-instance="{ threshold: 0.3, throttle: 300 }"
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      id="testimonials"
      v-motion="departmentsMotion"
      :headline="page.testimonials.headline"
      :title="page.testimonials.title"
      :description="page.testimonials.description"
      :motion-instance="{ threshold: 0.3, throttle: 300 }"
    >
      <UPageColumns class="xl:columns-5">
        <UPageCard
          v-for="(testimonial, index) in page.testimonials.items"
          :key="index"
          v-motion="cardMotions(index)"
          variant="subtle"
          :description="testimonial.quote"
          :ui="{ description: 'text-base before:content-[open-quote] after:content-[close-quote]' }"
          :motion-instance="{ threshold: 0.3, throttle: 300 }"
        >
          <template #footer>
            <UUser
              v-bind="testimonial.user"
              size="lg"
            />
          </template>
        </UPageCard>
      </UPageColumns>
    </UPageSection>

    <USeparator />

    <UPageCTA
      v-bind="page.cta"
      variant="naked"
      class="overflow-hidden"
    >
      <div class="absolute rounded-full dark:bg-(--ui-primary) blur-[250px] size-40 sm:size-50 transform -translate-x-1/2 left-1/2 -translate-y-80" />

      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
