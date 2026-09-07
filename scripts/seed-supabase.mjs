/**
 * One-time seed: insert 10 services + upload images from src/assets into Supabase.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-supabase.mjs
 *
 * Optional:
 *   SEED_SUPER_EMAIL=you@example.com SEED_SUPER_PASSWORD=... SEED_SUPER_NAME="Zack"
 *   SEED_ADMIN_EMAIL=client@example.com SEED_ADMIN_PASSWORD=... SEED_ADMIN_NAME="Client"
 */

import { createClient } from "@supabase/supabase-js";
import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const assetsRoot = path.join(root, "src", "assets");

const ASSET_MAP = {
  "front-of-house": {
    folder: "Front of House",
    prefixes: ["Front of House"],
  },
  "back-of-house": {
    folder: "Back of House",
    prefixes: ["Back of House"],
  },
  "kitchen-cleaning": {
    folder: "kitchen",
    prefixes: ["kitchen", "Kitchen", "Kitchen Cleaning"],
  },
  "spa-gymnasium": {
    folder: "Spa & Gymnasium",
    prefixes: ["Spa & Gymnasium"],
  },
  "window-cleaning": {
    folder: "Window Cleaning",
    prefixes: ["Window Cleaning"],
  },
  "carpet-cleaning": {
    folder: "Carpet Cleaning",
    prefixes: ["Carpet Cleaning"],
  },
  "public-pedestrian-areas": {
    folder: "Public & Pedestrian",
    prefixes: ["Public & Pedestrian"],
  },
  "specialist-services": {
    folder: "Specialist Services",
    prefixes: ["Specialist Services"],
  },
  "office-cleaning": {
    folder: "Office Cleaning",
    prefixes: ["Office Cleaning"],
  },
  "school-cleaning": {
    folder: "School Cleaning",
    prefixes: ["School Cleaning"],
  },
};

const SERVICES = [
  {
    id: "front-of-house",
    title: "Front of House",
    slug: "front-of-house",
    content: `
      They say “first impressions count” — we believe they define everything.
      Before a word is spoken or a service is delivered, your environment speaks on your behalf. The moment someone enters your premises, they form an immediate and lasting perception of your standards, your professionalism, and your attention to detail. That moment is not just important — it is critical.

      Your front of house is the signature of your business. It sets the tone, shapes expectations, and influences how your brand is experienced from the very first step inside. Every surface, every space, and every detail must reflect a level of care that is both visible and felt.

      At NativeShine Cleaning Ltd, we treat your front of house as a direct extension of your reputation. Our approach goes beyond cleaning — we deliver an environment that is consistently refined, immaculately presented, and aligned with the highest professional standards.

      Our Front of House Cleaning Team operates with a clear sense of ownership, discretion, and precision. We do not simply maintain spaces; we take responsibility for them. Every task is carried out with intent, ensuring that your premises are not only clean, but seamlessly presented at all times — ready to welcome, impress, and perform.

      We understand that true quality lies in consistency. That is why our service is built around reliability, attention to detail, and an uncompromising commitment to excellence. We work in harmony with your expectations, ensuring your environment reflects the same level of pride you hold in your business.

      With NativeShine Cleaning Ltd, your front of house will always represent your organisation at its absolute best — polished, professional, and prepared without exception.

      Because at NativeShine, we don’t follow standards — we set them.

      Excellence. Without compromise.
    `,
  },
  {
    id: "back-of-house",
    title: "Back of House",
    slug: "back-of-house",
    content: `
      Back of house areas sit at the very core of any successful premises. While they may not always be visible to customers, they play a critical role in ensuring that operations run smoothly, efficiently, and to the highest standard. Maintaining exceptional cleanliness in these spaces is essential, as it directly impacts the quality, safety, and consistency of the services you deliver.

      These areas are often highly multifunctional, accommodating everything from staff movement and storage to food preparation, equipment handling, and operational coordination. Due to this complexity, it is vital to partner with a cleaning provider that offers a broad range of specialist skills and understands the unique demands of each environment. A well-maintained back of house allows your team to perform at their best, minimising disruption, reducing risks, and supporting seamless day-to-day operations.

      At NativeShine Cleaning Ltd, we recognise that excellence behind the scenes is just as important as what your customers see. Our experienced team delivers meticulous, detail-focused cleaning solutions tailored to your premises, ensuring that every area — from kitchens and service corridors to storage and staff facilities — is maintained to the highest professional standard.

      We take pride in ensuring that your back of house is kept just as pristine, organised, and hygienic as your front of house, creating a consistent standard of cleanliness throughout your entire operation.

      Research consistently shows that employees who work in a clean, safe, and well-maintained environment are not only happier, but also more focused, motivated, and productive. By investing in high-quality cleaning services, you are not only protecting your business standards but also supporting the wellbeing and performance of your team.

      With NativeShine Cleaning Ltd, you can rely on a dependable partner committed to delivering excellence, professionalism, and results you can trust — no matter the size or complexity of your premises.
    `,
  },
  {
    id: "kitchen",
    title: "Kitchen Cleaning",
    slug: "kitchen-cleaning",
    content: `
      There is no working environment more critical to maintain than the kitchen. It is the heart of any hospitality operation — where standards, safety, and reputation are defined every day.

      At NativeShine Cleaning Ltd, we understand that a clean kitchen is essential to delivering quality service and maintaining trust. Our experienced Back of House teams are fully trained to handle all aspects of kitchen cleaning, ensuring a safe, compliant, and efficient working environment.

      We provide flexible, 24-hour support tailored to your needs, including:
      - Day and night janitorial services
      - Kitchen support staff, including porters and stewards
      - Banqueting and events support

      In addition, we deliver specialist deep cleaning services, including extraction and ducting cleans, full kitchen sanitisation, and infection control monitoring specific to catering environments.

      With NativeShine Cleaning Ltd, your kitchen is maintained to the highest professional standard — clean, compliant, and always ready to perform.

      EXCELLENCE IS THE STANDARD .
    `,
  },
  {
    id: "spa",
    title: "Spa & Gymnasium",
    slug: "spa-gymnasium",
    content: `
      When clients enter your spa or gymnasium, they expect a clean, calm, and hygienic environment that supports their wellbeing.

      At NativeShine Cleaning Ltd, we ensure your facilities consistently meet these high expectations. Our specialist teams maintain a fresh, safe, and professionally presented space, allowing you and your staff to focus on delivering exceptional client care.

      We work closely with your team to uphold your internal standards and health requirements, ensuring your environment remains fully compliant and consistently maintained.

      In addition to daily cleaning, we provide deep cleaning, full sanitisation, and advanced infection control monitoring tailored specifically for spa and health facilities.

      With NativeShine Cleaning Ltd, your space remains clean, safe, and ready to perform.

      EXCELLENCE IS THE STANDARD.
    `,
  },
  {
    id: "windows",
    title: "Window Cleaning",
    slug: "window-cleaning",
    content: `
      At NativeShine Cleaning Ltd, we provide reliable internal and external window cleaning for all property types, from single-storey to high-rise buildings.

      Using safe and effective methods, our team delivers a consistently clear, streak-free finish with attention to detail and professionalism.

      Flexible, efficient, and trusted — we ensure your building always looks its best.

      EXCELLENCE IS THE STANDARD.
    `,
  },
  {
    id: "carpet",
    title: "Carpet Cleaning",
    slug: "carpet-cleaning",
    content: `
      A well-maintained carpet is an investment that should stand the test of time. With the right care, it not only retains its appearance but also delivers long-lasting performance and durability.

      At NativeShine Cleaning Ltd, we provide specialist cleaning for a wide range of carpets and rugs — from delicate natural fibres such as silk and wool to hard-wearing commercial carpet tiles.

      Using advanced cleaning techniques, industry-leading equipment, and environmentally responsible products, we achieve deep, effective results while preserving the integrity of your flooring.

      In addition to one-off deep cleans, we offer tailored maintenance programmes designed to keep your carpets consistently fresh, clean, and professionally presented. We also provide expert carpet repair services, as well as supply and installation solutions to meet all your flooring needs.

      With NativeShine Cleaning Ltd, your carpets are maintained to the highest standard — enhancing both appearance and longevity.

      EXCELLENCE IS THE STANDARD.
    `,
  },
  {
    id: "public-areas",
    title: "Public & Pedestrian Areas",
    slug: "public-pedestrian-areas",
    content: `
      Every part of your premises contributes to the impression you create — especially the areas your clients encounter first. Entrances, walkways, and shared spaces are the arteries of your building and must be maintained to the highest standard at all times.

      At NativeShine Cleaning Ltd, we treat these areas with the same level of care and attention as your internal spaces. From the moment your clients arrive, we ensure your environment reflects cleanliness, professionalism, and pride.

      Well-maintained pedestrian areas not only enhance appearance but also help prevent dirt being carried into your premises, supporting a cleaner and more hygienic environment overall.

      With NativeShine Cleaning Ltd, your exterior and high-traffic areas are always clean, presentable, and ready to make the right impression.

      EXCELLENCE IS THE STANDARD.
    `,
  },
  {
    id: "specialist",
    title: "Specialist Services",
    slug: "specialist-services",
    content: `
      At NativeShine Cleaning Ltd, we go beyond traditional cleaning to deliver a comprehensive range of specialist and support services designed to enhance and support your operations.

      Our capabilities include:
      - Chewing gum and graffiti removal
      - Building façade and cladding cleaning
      - Gutter clearing and maintenance
      - Builders’ handover cleans
      - Specialist project management
      - Cleaning equipment procurement and repair
      - Supply of professional cleaning chemicals
      - Staff training and development
      - Provision of cleaning and hospitality support staff

      Our integrated approach ensures that every aspect of your cleaning and operational requirements is managed efficiently, professionally, and to the highest standard.

      With NativeShine Cleaning Ltd, you benefit from a complete, reliable, and flexible service solution tailored to your business needs.

      EXCELLENCE IS THE STANDARD.
    `,
  },
  {
    id: "office-cleaning",
    title: "Office Cleaning Services",
    slug: "office-cleaning",
    content: `
Professional Cleaning for Clean and Well-Maintained Workplaces

At  NATIVESHINE, we provide reliable and professional office cleaning services designed to maintain clean, hygienic, and well-presented working environments. We understand that a well-maintained office reflects professionalism and creates a comfortable environment for employees, clients, and visitors.

Our trained and supervised cleaning staff deliver high-quality cleaning services for offices, workstations, meeting rooms, reception areas, washrooms, kitchens, and communal spaces. Services include dusting, floor cleaning, vacuuming, waste removal, surface sanitisation, glass cleaning, and disinfection of frequently touched areas to maintain excellent hygiene standards throughout the workplace.

With flexible daily, weekly, and customised cleaning schedules, NATIVESHINE delivers dependable cleaning solutions with consistency, professionalism, and attention to detail.`,
  },
  {
    id: "school-cleaning",
    title: "School Cleaning Services",
    slug: "school-cleaning",
    content: `
    Creating Safe, Hygienic, and Well-Maintained School Environments

At  NATIVESHINE, we provide professional school cleaning services focused on maintaining clean, safe, and hygienic educational environments for students, staff, and visitors. Our cleaning services support high standards of cleanliness, hygiene, and day-to-day maintenance across school facilities.

Our cleaning team provides comprehensive cleaning for classrooms, libraries, laboratories, staff offices, washrooms, hallways, playgrounds, and shared facilities. Services include floor cleaning, dusting, waste management, washroom sanitation, disinfection of high-touch surfaces, and general cleaning throughout the premises.

NATIVESHINE delivers reliable and professional cleaning services through trained staff, quality supervision, and flexible cleaning schedules tailored to the needs of each educational facility. We are committed to maintaining clean and well-presented environments with professionalism, care, and attention to detail
    `,
  },
];

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function findSlotFile(folder, prefixes, slot) {
  const dir = path.join(assetsRoot, folder);
  let entries = [];
  try {
    entries = await readdir(dir);
  } catch {
    return null;
  }
  const lower = new Map(entries.map((e) => [e.toLowerCase(), e]));
  for (const prefix of prefixes) {
    for (const spaced of [false, true]) {
      const base = spaced ? `${prefix} ${slot}` : `${prefix}${slot}`;
      for (const ext of [".png", ".jpg", ".jpeg"]) {
        const name = base + ext;
        const hit = lower.get(name.toLowerCase());
        if (hit) return path.join(dir, hit);
      }
    }
  }
  return null;
}

async function ensureUser(admin, { email, password, full_name, role }) {
  if (!email || !password) return null;
  const { data: listed } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const existing = listed?.users?.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (existing) {
    await admin
      .from("profiles")
      .update({ full_name, role, email })
      .eq("id", existing.id);
    console.log(`User exists, profile updated: ${email} (${role})`);
    return existing.id;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role },
  });
  if (error) throw error;
  await admin
    .from("profiles")
    .update({ full_name, role, email })
    .eq("id", data.user.id);
  console.log(`Created user: ${email} (${role})`);
  return data.user.id;
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.",
    );
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("Seeding services…");
  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    const { data: service, error } = await supabase
      .from("services")
      .upsert(
        {
          slug: s.slug,
          title: s.title,
          content: s.content.trim(),
          sort_order: i,
          is_published: true,
        },
        { onConflict: "slug" },
      )
      .select("id, slug")
      .single();
    if (error) throw error;

    const cfg = ASSET_MAP[s.slug];
    if (!cfg) {
      console.warn(`No asset map for ${s.slug}`);
      continue;
    }

    for (let slot = 1; slot <= 6; slot++) {
      const filePath = await findSlotFile(cfg.folder, cfg.prefixes, slot);
      if (!filePath) {
        console.warn(`  missing ${s.slug} slot ${slot}`);
        continue;
      }
      const buf = await readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const storagePath = `${s.slug}/${slot}${ext}`;
      const contentType = MIME[ext] || "application/octet-stream";

      const { error: upErr } = await supabase.storage
        .from("service-images")
        .upload(storagePath, buf, { contentType, upsert: true });
      if (upErr) throw upErr;

      const {
        data: { publicUrl },
      } = supabase.storage.from("service-images").getPublicUrl(storagePath);

      const kinds =
        slot === 1
          ? [
              { kind: "thumbnail", slot: 1 },
              { kind: "hero", slot: 1 },
              { kind: "recent", slot: 1 },
            ]
          : [{ kind: "recent", slot }];

      for (const k of kinds) {
        const { error: imgErr } = await supabase.from("service_images").upsert(
          {
            service_id: service.id,
            kind: k.kind,
            slot: k.slot,
            url: publicUrl,
            storage_path: storagePath,
          },
          { onConflict: "service_id,kind,slot" },
        );
        if (imgErr) throw imgErr;
      }
      console.log(`  ${s.slug} slot ${slot} → ${storagePath}`);
    }
  }

  await ensureUser(supabase, {
    email: process.env.SEED_SUPER_EMAIL,
    password: process.env.SEED_SUPER_PASSWORD,
    full_name: process.env.SEED_SUPER_NAME || "Super Admin",
    role: "super",
  });
  await ensureUser(supabase, {
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
    full_name: process.env.SEED_ADMIN_NAME || "Client Admin",
    role: "admin",
  });

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
