/**
 * Service content + image URLs.
 *
 * Card + hero + gallery (first three slots) resolve from `src/assets/{Folder}/` via
 * `getServiceImageSet` (see src/lib/resolveServiceImages.js, src/config/recentWorksAssetFolders.js).
 * Filename pattern per folder: e.g. `Front of House1.png` … `3.jpg`, mixed extensions OK.
 * If a file is missing, fallbacks are public/images/services/ and recent-works paths.
 */

import { getServiceImageSet } from "../lib/resolveServiceImages";

export const servicesData = [
  {
    id: "front-of-house",
    title: "Front of House",
    slug: "front-of-house",
    ...getServiceImageSet("front-of-house"),
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
    ...getServiceImageSet("back-of-house"),
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
    ...getServiceImageSet("kitchen-cleaning"),
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
    ...getServiceImageSet("spa-gymnasium"),
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
    ...getServiceImageSet("window-cleaning"),
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
    ...getServiceImageSet("carpet-cleaning"),
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
    ...getServiceImageSet("public-pedestrian-areas"),
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
    ...getServiceImageSet("specialist-services"),
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
].map((service) => ({
  ...service,
  /** @deprecated Use imageThumbnail — kept for any legacy references */
  image: service.imageThumbnail,
}));
