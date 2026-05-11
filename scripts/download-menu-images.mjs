// Download all menu images from the thrubits menu into public/menu-images/
// Run with: node scripts/download-menu-images.mjs

import { mkdir, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const BASE = 'https://rest.thrubits.com'

const categoryImages = [
  { slug: 'cookies',        src: '/uploads/restorants_icon/1684132135.png', ext: 'png' },
  { slug: 'cinnamon-rolls', src: '/uploads/restorants_icon/1684132279.png', ext: 'png' },
  { slug: 'brownies',       src: '/uploads/restorants_icon/1683795871.png', ext: 'png' },
  { slug: 'cupcakes',       src: '/uploads/restorants_icon/1684132355.png', ext: 'png' },
  { slug: 'cake-pops',      src: '/uploads/restorants_icon/1683795829.png', ext: 'png' },
  { slug: 'croissants',     src: '/uploads/restorants_icon/1694685540.jpg', ext: 'jpg' },
  { slug: 'giant-cookies',  src: '/uploads/restorants_icon/1684132324.png', ext: 'png' },
  { slug: 'boxes',          src: '/uploads/restorants_icon/1684132234.png', ext: 'png' },
  { slug: 'breakables',     src: '/uploads/restorants_icon/1683795879.png', ext: 'png' },
  { slug: 'oreos',          src: '/uploads/restorants_icon/1683795862.png', ext: 'png' },
  { slug: 'rice-krispies',  src: '/uploads/restorants_icon/1684132561.png', ext: 'png' },
]

// uuid → local filename (without extension, always jpg from thrubits)
const productImages = [
  // Cookies
  { name: 'cookie-chocolate-chip',            uuid: '5dae9e37-ad93-40d1-89cd-74847396c678' },
  { name: 'cookie-nutella',                   uuid: '9bbb9f3c-d8f4-4d9b-9981-0dc3aedd51ce' },
  { name: 'cookie-snickers',                  uuid: '756ad60e-24eb-4bfd-aa80-7e3691936871' },
  { name: 'cookie-mars',                      uuid: '707d123c-ac32-44b2-be1a-59a63e4eaa88' },
  { name: 'cookie-twix',                      uuid: 'dfd76878-98b5-49eb-a22f-35d30309e982' },
  { name: 'cookie-oreo',                      uuid: 'ed6550b7-dd60-435a-8ddc-2eecc886115d' },
  { name: 'cookie-red-velvet',                uuid: 'cba36943-fe75-4421-bc20-9fe1afdb332b' },
  { name: 'cookie-red-velvet-nutella',        uuid: 'e48dae91-8414-4ba1-97ea-d6864b9ef707' },
  { name: 'cookie-half-rv-half-choc',        uuid: 'e9fb060d-a424-48b5-92d0-4d39de6ed6a8' },
  { name: 'cookie-mm',                        uuid: 'd984e4b9-78d8-4562-9568-13259c7b4a43' },
  { name: 'cookie-bueno',                     uuid: '82d5a0ef-f4d9-45f7-b317-1de56d14290a' },
  { name: 'cookie-lotus',                     uuid: '6771e4b8-b296-483b-bb03-b6318c49be7c' },
  { name: 'cookie-red-velvet-oreo',           uuid: '109f80ef-f875-43c3-8ba4-7f2c7f7a3fbf' },
  { name: 'cookie-newyorker',                 uuid: '87fffd28-acbd-4864-aa24-aeff207a74aa' },
  { name: 'cookie-white-choc-newyorker',     uuid: '99bd8dfd-9935-4887-bfcf-b056455604ca' },
  { name: 'cookie-double-choc-newyorker',    uuid: 'e0e577fc-ed2a-4a70-8015-8a30f26bd196' },
  { name: 'cookie-marshmallow',               uuid: '3d82d096-5c20-4a08-887b-6ad508e609cb' },
  { name: 'cookie-mini',                      uuid: 'a8075514-7dd4-482c-b549-c2566f845785' },
  // Cinnamon Rolls
  { name: 'cinnamon-original',                uuid: 'f3760fdb-76e6-4214-b70e-9ef58411cd4d' },
  { name: 'cinnamon-nutella',                 uuid: '2efacf9a-2dcd-4256-92b3-cda35f5df1cb' },
  { name: 'cinnamon-lotus',                   uuid: 'ec0723a0-77a4-4741-8df0-14be66e36126' },
  { name: 'cinnamon-oreo',                    uuid: 'afad6e0c-eea4-4e60-be3a-60f6741a7c08' },
  { name: 'cinnamon-red-velvet',              uuid: 'dd39063c-67f5-4525-ab98-482b43d62416' },
  { name: 'cinnamon-pistachio',               uuid: 'c5b8c334-ac5c-4f10-b19c-8b64d063e1fe' },
  // Brownies
  { name: 'brownie-nutella',                  uuid: '8f3ab5fe-8cc7-4aa2-a6d6-27d7e228136c' },
  { name: 'brownie-caramel-twix',             uuid: '96fd9888-319e-4b00-aab3-2cbdd652ac7e' },
  { name: 'brownie-brookie',                  uuid: '1cfabdc1-b958-47c1-88dd-39f5ccb7eec1' },
  { name: 'brownie-lotus-blondie',            uuid: 'bffcdd72-2db6-40ee-a233-ffc565065f4d' },
  // Cupcakes
  { name: 'cupcake-classic',                  uuid: 'b51e9a77-231e-4e38-9c6e-c3affe2317d2' },
  { name: 'cupcake-with-sugar-piece',        uuid: '6e6f1500-9ab2-42de-bd92-afc0129976b8' },
  { name: 'cupcake-cookie-dough-choc',       uuid: 'd7887264-3cab-4d25-a076-5fe781fcf355' },
  { name: 'cupcake-red-velvet-layered',      uuid: '726d54a7-16d0-4379-afee-045cd39aa25b' },
  { name: 'cupcake-red-velvet-oreo',         uuid: '1973030f-27c7-4c31-b8e7-df8f5a7c0d2f' },
  { name: 'cupcake-vanilla-layered',         uuid: 'fcf6526e-a2e5-4a6e-8fd9-3f2b4c63fba2' },
  { name: 'cupcake-box-of-4',               uuid: '049ce6da-8d76-4189-a66b-fa01199a6a52' },
  // Cake Pops
  { name: 'cakepop-vanilla',                  uuid: '65a2cf53-abb8-4b37-8b74-f98fdf57e53c' },
  { name: 'cakepop-chocolate',                uuid: 'c332763b-10fb-48d8-a7d6-ef72e9e1f4f9' },
  { name: 'cakepop-red-velvet',               uuid: '3a1cad43-b91b-4fdf-b046-1b5abf67850e' },
  { name: 'cakepop-cookie-dough',             uuid: 'ebc7b5d9-24a8-4eb5-b9f7-5b1b376d38ce' },
  { name: 'cakepop-cookie-dough-nutella',    uuid: '0a2ee43f-77c7-4670-aea0-537493cd4567' },
  { name: 'cakepop-red-velvet-nutella',      uuid: 'ccf6ce27-0c5a-4b7d-bd2e-14fa7fc0882c' },
  { name: 'cakepop-rainbow',                  uuid: '6b92f418-6e7e-4a14-8485-a10ca27c931a' },
  // Croissants
  { name: 'croissant-chocolate',              uuid: 'bb1f79c1-ed1f-4249-96a1-e20ab73e4e1c' },
  { name: 'croissant-four-cheeses',           uuid: '692cbfad-1578-42fe-9e15-effb91c952a3' },
  { name: 'croissant-turkey-cheese',          uuid: '5fa2e1d5-575e-4dcc-a576-fb26eed4e194' },
  { name: 'croissant-spicy-feta',             uuid: 'e40890de-73f5-49f9-99ad-7cebe1ad5daa' },
  { name: 'croissant-lotus-hersheys',         uuid: '28e4bcc7-4c5f-4607-8957-51176ed5c38c' },
  { name: 'croissant-creme-brulee',           uuid: '19c19f50-0c35-409f-83b6-dc6e2c5f6c54' },
  { name: 'croissant-pistachio',              uuid: '0e3b7a04-2cb6-435e-94c4-9228dbce4cb5' },
  { name: 'croissant-crookie',                uuid: 'f40e14fb-b922-496c-932f-1959bcc2b2da' },
  { name: 'croissant-lotus-crookie',          uuid: 'df8e8786-da10-4a94-abd9-daae1c270676' },
  // Giant Cookies
  { name: 'giant-34cm',                       uuid: 'd159e73d-27e5-4541-98fe-e0abff5bd23a' },
  { name: 'giant-34cm-toppings',              uuid: 'a2582375-bfd4-4462-89cb-75ae08443854' },
  { name: 'giant-20cm',                       uuid: 'e1c5d0e0-1047-4118-a8df-87de8f13846c' },
  { name: 'giant-20cm-toppings',              uuid: '9eb03649-8330-4515-ad09-a05aa3416203' },
  { name: 'giant-heart',                      uuid: '8a4ad108-59d5-4d30-ae5c-4a492159e92b' },
  // Boxes
  { name: 'box-of-6',                         uuid: 'c15798b0-be52-410a-bcd2-53fe34a522d2' },
  { name: 'box-of-12',                        uuid: '53859bd3-ff3c-4d46-8b24-0a8f2e539de7' },
  { name: 'box-dessert',                      uuid: '75e36465-fbf5-46cf-abce-6b92a556dd40' },
  // Breakables
  { name: 'breakable-small-heart',            uuid: '3ff11ae0-ad86-48ea-9caa-87a7779cdde5' },
  { name: 'breakable-large-heart',            uuid: 'f96f2d65-e1e6-4623-9627-f31379002502' },
  { name: 'breakable-cookie-dough-heart',    uuid: 'ed4b73e4-71bb-4df1-ab32-cb7c3d292735' },
  { name: 'breakable-donut',                  uuid: '7334cfe6-b43b-4d20-89c7-e56b20c29541' },
  { name: 'breakable-giant-egg',              uuid: '7e5e9f90-3887-4385-887e-0f72378e0b2e' },
  // Oreos
  { name: 'oreo-dipped',                      uuid: 'e7feb454-931c-4bfa-9957-58aaf59bf129' },
  { name: 'oreo-cookie-dough-nutella',        uuid: '59a6c504-f209-4b95-9936-eead133f3797' },
  { name: 'oreo-box',                         uuid: 'dc88427b-5e25-4040-9174-4b5d89a32ad0' },
  // Rice Krispies
  { name: 'rice-krispies',                    uuid: '12d75653-3e09-4d51-91b6-98066f18e516' },
  { name: 'rice-krispies-fruity',             uuid: '46492a4f-b749-42b8-8fdc-c1d986e13d52' },
]

async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
}

async function main() {
  const catDir = join(ROOT, 'public', 'menu-images', 'categories')
  const prodDir = join(ROOT, 'public', 'menu-images', 'products')
  await mkdir(catDir, { recursive: true })
  await mkdir(prodDir, { recursive: true })

  let ok = 0, fail = 0

  console.log(`\nDownloading ${categoryImages.length} category images...`)
  for (const cat of categoryImages) {
    const dest = join(catDir, `${cat.slug}.${cat.ext}`)
    try {
      await download(BASE + cat.src, dest)
      console.log(`  ✓ ${cat.slug}`)
      ok++
    } catch (e) {
      console.log(`  ✗ ${cat.slug}: ${e.message}`)
      fail++
    }
  }

  console.log(`\nDownloading ${productImages.length} product images...`)
  for (const prod of productImages) {
    const src = `/uploads/restorants/${prod.uuid}_medium.jpg`
    const dest = join(prodDir, `${prod.name}.jpg`)
    try {
      await download(BASE + src, dest)
      console.log(`  ✓ ${prod.name}`)
      ok++
    } catch (e) {
      console.log(`  ✗ ${prod.name}: ${e.message}`)
      fail++
    }
  }

  console.log(`\nDone: ${ok} downloaded, ${fail} failed`)
}

main().catch(console.error)
