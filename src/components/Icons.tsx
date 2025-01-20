import { splitProps, type ComponentProps } from 'solid-js'

import { cn } from '~/lib/utils'

type IconProps = ComponentProps<'svg'>

const Icon = (props: IconProps) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
      class={cn('size-4', props.class)}
      {...rest}
    />
  )
}

export function IconLogo(props: IconProps) {
  return (
    <Icon viewBox='0 0 24 24' {...props}>
      <path d='M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' />
      <path d='m3.3 7 8.7 5 8.7-5' />
      <path d='M12 22V12' />
    </Icon>
  )
}

// ICONS

export function CategoryKitchen(props: IconProps) {
  return (
    <Icon {...props}>
      <g>
        <path
          fill='#2C6991'
          d='M295.468,512c-9.342,0-16.915-7.573-16.915-16.915V212.042c0-9.342,7.573-16.915,16.915-16.915 c9.342,0,16.915,7.573,16.915,16.915v283.043C312.383,504.428,304.81,512,295.468,512z'
        />
        <path
          fill='#528FB3'
          d='M295.468,512c-9.021,0-16.915-7.573-16.915-16.915V212.042c0-9.342,7.894-16.915,16.915-16.915V512z'
        />
        <path
          fill='#2C6991'
          d='M97,512c-9.342,0-16.915-7.573-16.915-16.915V212.042c0-9.342,7.573-16.915,16.915-16.915 s16.915,7.573,16.915,16.915v283.043C113.915,504.428,106.341,512,97,512z'
        />
        <path
          fill='#528FB3'
          d='M97,512c-9.342,0-16.915-7.573-16.915-16.915V212.042c0-9.342,7.573-16.915,16.915-16.915V512z'
        />
        <path
          fill='#2C6991'
          d='M426.277,512c-9.342,0-16.915-7.573-16.915-16.915V316.915h33.83v178.171 C443.192,504.428,435.618,512,426.277,512z'
        />
        <path fill='#528FB3' d='M426.277,512c-9.342,0-16.915-7.573-16.915-16.915V316.915h16.915V512z' />
        <path
          fill='#4AD0FF'
          d='M460.279,12.294c-9.158-8.063-21.763-9.95-32.883-4.926c-11.119,5.025-18.035,15.726-18.035,27.929 v293.247h33.83v-4.896l49.835-32.685c4.763-3.127,7.676-8.442,7.676-14.141V101.58C500.703,67.414,485.923,34.871,460.279,12.294z'
        />
        <path
          fill='#99E5FF'
          d='M443.176,4.747c-5.254-0.536-10.673,0.313-15.779,2.621c-11.119,5.025-18.035,15.726-18.035,27.929 v293.247h33.83V4.749L443.176,4.747z'
        />
      </g>
    </Icon>
  )
}

export function CategoryBathroom(props: IconProps) {
  return (
    <Icon {...props}>
      <g>
        <path
          id='secondary'
          d='M17,22a1,1,0,0,1-1-1V5a1,1,0,0,0-1-1H10A1,1,0,0,0,9,5V6A1,1,0,0,1,7,6V5a3,3,0,0,1,3-3h5a3,3,0,0,1,3,3V21A1,1,0,0,1,17,22Z'
          fill='#2ca9bc'
        />
        <path
          id='primary'
          d='M12,9v1a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V9a4,4,0,0,1,8,0Zm8,12a1,1,0,0,0-1-1H15a1,1,0,0,0,0,2h4A1,1,0,0,0,20,21Z'
          fill='#000000'
        />
      </g>
    </Icon>
  )
}

export function CategoryHome(props: IconProps) {
  return (
    <Icon {...props}>
      <g>
        <path d='M496 124.608L96 524.576V1024h832V556.576z' fill='#EAEAEA' />
        <path d='M256 672h224v352H256z' fill='#434854' />
        <path d='M544 640h96v96h-96zM672 640h96v96h-96zM672 512h96v96h-96zM544 512h96v96h-96z' fill='#469FCC' />
        <path d='M544 512h96v32h-96zM672 512h96v32h-96zM544 640h96v32h-96zM672 640h96v32h-96z' fill='' />
        <path d='M496 64L96 480v96L496 176 928 608v-96z' fill='' />
        <path
          d='M1012.576 505.376L541.248 34.048l-22.624-22.624a31.968 31.968 0 0 0-45.248 0l-22.624 22.624L11.424 473.376a31.968 31.968 0 0 0 0 45.248l22.624 22.624a31.968 31.968 0 0 0 45.248 0L496 124.608l448.672 448.672a31.968 31.968 0 0 0 45.248 0l22.624-22.624a32.032 32.032 0 0 0 0.032-45.28z'
          fill='#EF4D4D'
        />
        <path
          d='M238.24 1024A126.656 126.656 0 0 0 256 960a128 128 0 0 0-256 0c0 23.424 6.752 45.088 17.76 64h220.48z'
          fill='#3AAD73'
        />
      </g>
    </Icon>
  )
}

export function IconAlertTriangle(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 9v4' />
      <path d='M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z' />
      <path d='M12 16h.01' />
    </Icon>
  )
}

export function IconArchive(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z' />
      <path d='M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10' />
      <path d='M10 12l4 0' />
    </Icon>
  )
}

export function IconArrowDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 5l0 14' />
      <path d='M18 13l-6 6' />
      <path d='M6 13l6 6' />
    </Icon>
  )
}

export function IconArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M5 12l14 0' />
      <path d='M13 18l6 -6' />
      <path d='M13 6l6 6' />
    </Icon>
  )
}

export function IconArrowUp(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 5l0 14' />
      <path d='M18 11l-6 -6' />
      <path d='M6 11l6 -6' />
    </Icon>
  )
}

export function IconBell(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6' />
      <path d='M9 17v1a3 3 0 0 0 6 0v-1' />
    </Icon>
  )
}

export function IconBold(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M7 5h6a3.5 3.5 0 0 1 0 7h-6z' />
      <path d='M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7' />
    </Icon>
  )
}

export function IconBrandApple(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M8.286 7.008c-3.216 0 -4.286 3.23 -4.286 5.92c0 3.229 2.143 8.072 4.286 8.072c1.165 -.05 1.799 -.538 3.214 -.538c1.406 0 1.607 .538 3.214 .538s4.286 -3.229 4.286 -5.381c-.03 -.011 -2.649 -.434 -2.679 -3.23c-.02 -2.335 2.589 -3.179 2.679 -3.228c-1.096 -1.606 -3.162 -2.113 -3.75 -2.153c-1.535 -.12 -3.032 1.077 -3.75 1.077c-.729 0 -2.036 -1.077 -3.214 -1.077z' />
      <path d='M12 4a2 2 0 0 0 2 -2a2 2 0 0 0 -2 2' />
    </Icon>
  )
}

export function IconBrandGithub(props: IconProps) {
  return (
    <Icon stroke='none' fill='currentColor' {...props}>
      <path d='M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z' />
      {/* <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" /> */}
    </Icon>
  )
}

export function IconBrandGoogle(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M20.945 11a9 9 0 1 1 -3.284 -5.997l-2.655 2.392a5.5 5.5 0 1 0 2.119 6.605h-4.125v-3h7.945z' />
    </Icon>
  )
}

export function IconBrandInstagram(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z' />
      <path d='M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0' />
      <path d='M16.5 7.5l0 .01' />
    </Icon>
  )
}

export function IconBrandPaypal(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M10 13l2.5 0c2.5 0 5 -2.5 5 -5c0 -3 -1.9 -5 -5 -5h-5.5c-.5 0 -1 .5 -1 1l-2 14c0 .5 .5 1 1 1h2.8l1.2 -5c.1 -.6 .4 -1 1 -1zm7.5 -5.8c1.7 1 2.5 2.8 2.5 4.8c0 2.5 -2.5 4.5 -5 4.5h-2.6l-.6 3.6a1 1 0 0 1 -1 .8l-2.7 0a.5 .5 0 0 1 -.5 -.6l.2 -1.4' />
    </Icon>
  )
}

export function IconBrandReddit(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14z' />
      <path d='M12 8l1 -5l6 1' />
      <path d='M19 4m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
      <circle cx='9' cy='13' r='.5' fill='currentColor' />
      <circle cx='15' cy='13' r='.5' fill='currentColor' />
      <path d='M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5' />
    </Icon>
  )
}

export function IconBrandTypescript(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M15 17.5c.32 .32 .754 .5 1.207 .5h.543c.69 0 1.25 -.56 1.25 -1.25v-.25a1.5 1.5 0 0 0 -1.5 -1.5a1.5 1.5 0 0 1 -1.5 -1.5v-.25c0 -.69 .56 -1.25 1.25 -1.25h.543c.453 0 .887 .18 1.207 .5' />
      <path d='M9 12h4' />
      <path d='M11 12v6' />
      <path d='M21 19v-14a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2z' />
    </Icon>
  )
}

export function IconBrandVercel(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M3 19h18l-9 -15z' fill='currentColor' />
    </Icon>
  )
}

export function IconBrandX(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M4 4l11.733 16h4.267l-11.733 -16z' />
      <path d='M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772' />
    </Icon>
  )
}

export function IconBrandYoutube(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z' />
      <path d='M10 9l5 3l-5 3z' />
    </Icon>
  )
}

export function IconCalendar(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z' />
      <path d='M16 3v4' />
      <path d='M8 3v4' />
      <path d='M4 11h16' />
      <path d='M11 15h1' />
      <path d='M12 15v3' />
    </Icon>
  )
}

export function IconCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M5 12l5 5l10 -10' />
    </Icon>
  )
}

export function IconChevronDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M6 9l6 6l6 -6' />
    </Icon>
  )
}

export function IconChevronLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M15 6l-6 6l6 6' />
    </Icon>
  )
}

export function IconChevronRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M9 6l6 6l-6 6' />
    </Icon>
  )
}

export function IconChevronUp(props: IconProps) {
  return (
    <Icon {...props}>
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M6 15l6 -6l6 6' />
    </Icon>
  )
}

export function IconChevronsLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M11 7l-5 5l5 5' />
      <path d='M17 7l-5 5l5 5' />
    </Icon>
  )
}

export function IconChevronsRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M7 7l5 5l-5 5' />
      <path d='M13 7l5 5l-5 5' />
    </Icon>
  )
}

export function IconCircle(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' />
    </Icon>
  )
}

export function IconCircleCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' />
      <path d='M9 12l2 2l4 -4' />
    </Icon>
  )
}

export function IconCircleHelp(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0' />
      <path d='M12 16v.01' />
      <path d='M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483' />
    </Icon>
  )
}

export function IconCircleOff(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M20.042 16.045a9 9 0 0 0 -12.087 -12.087m-2.318 1.677a9 9 0 1 0 12.725 12.73' />
      <path d='M3 3l18 18' />
    </Icon>
  )
}

export function IconCirclePlus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0' />
      <path d='M9 12h6' />
      <path d='M12 9v6' />
    </Icon>
  )
}

export function IconClock(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0' />
      <path d='M12 7v5l3 3' />
    </Icon>
  )
}

export function IconCloud(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878' />
    </Icon>
  )
}

export function IconCommand(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10' />
    </Icon>
  )
}

export function IconCopy(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z' />
      <path d='M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1' />
    </Icon>
  )
}

export function IconCashOnDelivery(props: IconProps) {
  const [, rest] = splitProps(props, ['class'])
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' class={cn('size-8', props.class)} {...rest}>
      <path
        d='M330.667 277.333C330.667 274.504 329.543 271.791 327.542 269.791C325.542 267.791 322.829 266.667 320 266.667H138.667C135.838 266.667 133.125 267.791 131.125 269.791C129.124 271.791 128 274.504 128 277.333V432H330.667V277.333Z'
        fill='#FAC100'
      />
      <path d='M256 266.667V330.667L229.333 314.667L202.667 330.667V266.667H256Z' fill='#F87600' />
      <path
        d='M362.666 96H138.667C132.776 96 128 100.776 128 106.667V213.333C128 219.224 132.776 224 138.667 224H362.666C368.557 224 373.333 219.224 373.333 213.333V106.667C373.333 100.776 368.557 96 362.666 96Z'
        fill='#00CF66'
      />
      <path
        d='M85.333 460.846L124.763 454.274C130.661 453.29 136.72 454.201 142.069 456.874L174.8 473.243C189.982 480.834 207.557 482.083 223.66 476.715L349.86 434.648C352.246 433.852 354.448 432.583 356.332 430.917C358.217 429.251 359.747 427.223 360.83 424.952C361.913 422.681 362.526 420.216 362.635 417.703C362.743 415.19 362.344 412.68 361.46 410.325V410.325C359.957 406.318 357.126 402.946 353.439 400.774C349.751 398.601 345.431 397.758 341.197 398.385L246.3 412.44C248.666 410.106 250.342 407.165 251.143 403.94V403.94C252.23 399.589 251.667 394.99 249.561 391.03C247.456 387.071 243.958 384.032 239.743 382.5L173.323 360.739C163.431 357.498 152.758 357.525 142.882 360.817L85.333 380V460.846Z'
        fill='#FFD188'
      />
      <path
        d='M426.667 146.807L385.806 165.087C377.584 168.766 368.678 170.667 359.67 170.667H254.639C250.549 170.667 246.591 169.216 243.47 166.572C240.349 163.928 238.267 160.263 237.594 156.228V156.228C237.214 153.947 237.295 151.613 237.834 149.364C238.372 147.115 239.357 144.997 240.729 143.135C242.101 141.273 243.832 139.706 245.821 138.526C247.81 137.346 250.016 136.577 252.307 136.265L312.857 128.018C316.28 127.552 319.538 126.262 322.352 124.259C325.166 122.256 327.451 119.6 329.012 116.518L339.394 96H177.268L193.847 75.111C199.656 67.7921 206.997 61.8339 215.354 57.655L256.587 38.755C269.991 32.0533 285.321 30.2676 299.906 33.709L426.667 61.9V146.807Z'
        fill='#FFD188'
      />
      <path
        d='M74.666 357.333H42.667C36.7758 357.333 32 362.109 32 368V463.999C32 469.89 36.7758 474.666 42.667 474.666H74.666C80.5572 474.666 85.333 469.89 85.333 463.999V368C85.333 362.109 80.5572 357.333 74.666 357.333Z'
        fill='#00CF66'
      />
      <path
        d='M469.333 42.667H437.334C431.443 42.667 426.667 47.4428 426.667 53.334V149.333C426.667 155.224 431.443 160 437.334 160H469.333C475.224 160 480 155.224 480 149.333V53.334C480 47.4428 475.224 42.667 469.333 42.667Z'
        fill='#00CF66'
      />
    </svg>
  )
}

export function IconPayByCard(props: IconProps) {
  const [, rest] = splitProps(props, ['class'])
  return (
    <svg viewBox='0 0 58 42' class={cn('size-8', props.class)} {...rest}>
      <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>
        <g id='040---Payment-Cards'>
          <path
            d='M12,32 L12,39 C12,40.6568542 13.3431458,42 15,42 L55,42 C56.6568542,42 58,40.6568542 58,39 L58,13 C58,11.3431458 56.6568542,10 55,10 L46,10 L12,32 Z'
            fill='#3B97D3'
          />
          <rect id='Rectangle' fill='#F29C1F' x='0' y='0' width='46' height='32' rx='3' />
          <rect id='Rectangle' fill='#F3D55B' x='30' y='4' width='12' height='9' rx='2' />
          <polygon id='Path' fill='#F0C419' points='35 4 35 13 33 13 33 9 30 9 30 7 33 7 33 4' />
          <path d='M42,7 L42,9 L39,9 L39,13 L37,13 L37,8 C37,7.44771525 37.4477153,7 38,7 L42,7 Z' fill='#F0C419' />
          <path
            d='M6,8 L20,8 C20.5522847,8 21,7.55228475 21,7 C21,6.44771525 20.5522847,6 20,6 L6,6 C5.44771525,6 5,6.44771525 5,7 C5,7.55228475 5.44771525,8 6,8 Z'
            fill='#F9EAB0'
          />
          <path
            d='M5,22 L11,22 C11.5522847,22 12,21.5522847 12,21 C12,20.4477153 11.5522847,20 11,20 L5,20 C4.44771525,20 4,20.4477153 4,21 C4,21.5522847 4.44771525,22 5,22 Z'
            fill='#F9EAB0'
          />
        </g>
      </g>
    </svg>
  )
}

export function IconDesktop(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10z' />
      <path d='M7 20h10' />
      <path d='M9 16v4' />
      <path d='M15 16v4' />
    </Icon>
  )
}

export function IconDots(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
      <path d='M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
      <path d='M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
    </Icon>
  )
}

export function IconDotsVertical(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
      <path d='M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
      <path d='M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
    </Icon>
  )
}

export function IconDownload(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2' />
      <path d='M7 11l5 5l5 -5' />
      <path d='M12 4l0 12' />
    </Icon>
  )
}

export function IconExternalLink(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6' />
      <path d='M11 13l9 -9' />
      <path d='M15 4h5v5' />
    </Icon>
  )
}

export function IconEyeOff(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M10.585 10.587a2 2 0 0 0 2.829 2.828' />
      <path d='M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87' />
      <path d='M3 3l18 18' />
    </Icon>
  )
}

export function IconFile(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M14 3v4a1 1 0 0 0 1 1h4' />
      <path d='M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z' />
    </Icon>
  )
}

export function IconForward(props: IconProps) {
  return (
    <Icon {...props}>
      <polyline points='15 17 20 12 15 7' />
      <path d='M4 18v-2a4 4 0 0 1 4-4h12' />
    </Icon>
  )
}

export function IconFullscreen(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M3 7V5a2 2 0 0 1 2-2h2' />
      <path d='M17 3h2a2 2 0 0 1 2 2v2' />
      <path d='M21 17v2a2 2 0 0 1-2 2h-2' />
      <path d='M7 21H5a2 2 0 0 1-2-2v-2' />
      <rect width='10' height='8' x='7' y='8' rx='1' />
    </Icon>
  )
}

export function IconHash(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M5 9l14 0' />
      <path d='M5 15l14 0' />
      <path d='M11 4l-4 16' />
      <path d='M17 4l-4 16' />
    </Icon>
  )
}

export function IconHome(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M5 12l-2 0l9 -9l9 9l-2 0' />
      <path d='M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7' />
      <path d='M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6' />
    </Icon>
  )
}

export function IconInbox(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z' />
      <path d='M4 13h3l3 3h4l3 -3h3' />
    </Icon>
  )
}

export function IconItalic(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M11 5l6 0' />
      <path d='M7 19l6 0' />
      <path d='M14 5l-4 14' />
    </Icon>
  )
}

export function IconLaptop(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M3 19l18 0' />
      <path d='M5 6m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z' />
    </Icon>
  )
}

export function IconLoader(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 6l0 -3' />
      <path d='M16.25 7.75l2.15 -2.15' />
      <path d='M18 12l3 0' />
      <path d='M16.25 16.25l2.15 2.15' />
      <path d='M12 18l0 3' />
      <path d='M7.75 16.25l-2.15 2.15' />
      <path d='M6 12l-3 0' />
      <path d='M7.75 7.75l-2.15 -2.15' />
    </Icon>
  )
}

export function IconMail(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z' />
      <path d='M3 7l9 6l9 -6' />
    </Icon>
  )
}

export function IconMessages(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z' />
      <path d='M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1' />
    </Icon>
  )
}

export function IconMinus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M5 12l14 0' />
    </Icon>
  )
}

export function IconMobile(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14z' />
      <path d='M11 4h2' />
      <path d='M12 17v.01' />
    </Icon>
  )
}

export function IconMoon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z' />
    </Icon>
  )
}

export function IconReply(props: IconProps) {
  return (
    <Icon {...props}>
      <polyline points='9 17 4 12 9 7' />
      <path d='M20 18v-2a4 4 0 0 0-4-4H4' />
    </Icon>
  )
}

export function IconReplyAll(props: IconProps) {
  return (
    <Icon {...props}>
      <polyline points='7 17 2 12 7 7' />
      <polyline points='12 17 7 12 12 7' />
      <path d='M22 18v-2a4 4 0 0 0-4-4H7' />
    </Icon>
  )
}

export function IconPlus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 5l0 14' />
      <path d='M5 12l14 0' />
    </Icon>
  )
}

export function IconRocket(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3' />
      <path d='M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3' />
      <path d='M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
    </Icon>
  )
}

export function IconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
      <path d='M21 21l-6 -6' />
    </Icon>
  )
}

export function IconSelector(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M8 9l4 -4l4 4' />
      <path d='M16 15l-4 4l-4 -4' />
    </Icon>
  )
}

export function IconSend(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M10 14l11 -11' />
      <path d='M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5' />
    </Icon>
  )
}

export function IconSettings(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z' />
      <path d='M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0' />
    </Icon>
  )
}

export function IconShoppingCart(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' />
      <path d='M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' />
      <path d='M17 17h-11v-14h-2' />
      <path d='M6 5l14 1l-1 7h-13' />
    </Icon>
  )
}

export function IconSidebarOpen(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z' />
      <path d='M9 4v16' />
      <path d='M14 10l2 2l-2 2' />
    </Icon>
  )
}

export function IconSmile(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' />
      <path d='M9 10l.01 0' />
      <path d='M15 10l.01 0' />
      <path d='M9.5 15a3.5 3.5 0 0 0 5 0' />
    </Icon>
  )
}

export function IconStar(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z' />
    </Icon>
  )
}

export function IconSun(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0' />
      <path d='M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7' />
    </Icon>
  )
}

export function IconTablet(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M18 3a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2z' />
      <path d='M9 18h6' />
    </Icon>
  )
}

export function IconTerminal(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M5 7l5 5l-5 5' />
      <path d='M12 19l7 0' />
    </Icon>
  )
}

export function IconTimer(props: IconProps) {
  return (
    <Icon {...props}>
      <line x1='10' x2='14' y1='2' y2='2' />
      <line x1='12' x2='15' y1='14' y2='11' />
      <circle cx='12' cy='14' r='8' />
    </Icon>
  )
}

export function IconTrash(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M4 7l16 0' />
      <path d='M10 11l0 6' />
      <path d='M14 11l0 6' />
      <path d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12' />
      <path d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3' />
    </Icon>
  )
}

export function IconUnderline(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M7 5v5a5 5 0 0 0 10 0v-5' />
      <path d='M5 19h14' />
    </Icon>
  )
}

export function IconUpdates(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4' />
      <path d='M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4' />
      <path d='M12 9l0 3' />
      <path d='M12 15l.01 0' />
    </Icon>
  )
}

export function IconUser(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0' />
      <path d='M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2' />
    </Icon>
  )
}

export function IconUsers(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0' />
      <path d='M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2' />
      <path d='M16 3.13a4 4 0 0 1 0 7.75' />
      <path d='M21 21v-2a4 4 0 0 0 -3 -3.85' />
    </Icon>
  )
}

export function IconX(props: IconProps) {
  return (
    <Icon {...props}>
      <path d='M18 6l-12 12' />
      <path d='M6 6l12 12' />
    </Icon>
  )
}
