import React from 'react';
import { ArrowRight, Github, Database, Server, Layers, Zap, Box, Lock, FileCode, Search, Globe, Activity, LayoutDashboard, Check, Moon, HardDrive } from 'lucide-react';

const QSymbol = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className={className}>
    <path d="M22 10V2H2v20h8" />
    <rect x="13" y="13" width="10" height="10" fill="#B700FF" stroke="none" />
  </svg>
);

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyle = "px-4 py-2 font-mono text-[13px] font-semibold uppercase tracking-[0.04em] transition-colors duration-150 inline-flex items-center justify-center gap-2 border-none outline-none focus:outline-2 focus:outline-offset-2 focus:outline-brand";
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    secondary: "bg-transparent text-white border border-surface-border hover:bg-surface-input",
    ghost: "bg-transparent text-brand hover:underline",
  };
  return (
    <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2 py-0.5 bg-surface-input text-brand font-mono text-[11px] font-semibold uppercase tracking-[0.04em]">
    {children}
  </span>
);

const TerminalBlock = ({ code, label }: { code: React.ReactNode, label?: string }) => (
  <div className="border border-surface-border bg-surface-bg relative h-full">
    {label && (
      <div className="absolute top-0 left-0 px-2 py-1 text-[10px] tracking-[0.2em] uppercase text-[#555] font-mono border-b border-r border-surface-border">
        {label}
      </div>
    )}
    <div className="p-4 pt-10 font-mono text-[13px] leading-[1.6] overflow-x-auto whitespace-pre text-[#ccc]">
      {code}
    </div>
  </div>
);

const BrutalistGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-surface-border border border-surface-border">
    {children}
  </div>
);

const FeatureCell = ({ num, title, desc }: { num: string, title: string, desc: string }) => (
  <div className="bg-surface-bg p-6 hover:border-brand border border-transparent transition-colors duration-150 flex flex-col h-full">
    <div className="text-brand font-mono text-[10px] tracking-[3px] mb-4">{num}</div>
    <h3 className="font-mono text-[14px] font-bold text-white mb-2">{title}</h3>
    <p className="font-sans text-[13px] text-[#666666] leading-[1.5]">{desc}</p>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-surface-bg text-white selection:bg-brand selection:text-white">
      {/* Navigation */}
      <nav className="h-14 bg-surface-bg sticky top-0 z-50 border-b border-surface-border">
        <div className="max-w-[1200px] mx-auto w-full h-full flex items-center justify-between px-4 md:px-8 border-x border-surface-border bg-surface-bg">
          <div className="flex items-center gap-8">
            <div className="font-mono font-bold text-lg tracking-tight flex items-center gap-2">
              QUESTPIE
            </div>
            <div className="hidden md:flex items-center gap-6 font-mono text-[12px] font-medium text-[#666666]">
              <a href="#" className="hover:text-white transition-colors">Docs</a>
              <a href="#" className="hover:text-white transition-colors">Examples</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[#666] hover:text-white transition-colors" aria-label="Toggle theme"><Moon className="w-4 h-4" /></button>
            <Button variant="primary" className="hidden sm:flex">Get started</Button>
            <QSymbol className="w-6 h-6 sm:hidden" />
          </div>
        </div>
      </nav>

      <main className="bg-grid">
        <div className="max-w-[1200px] mx-auto border-x border-surface-border">
        {/* Hero Section */}
        <section className="px-4 md:px-8 py-24 md:py-32 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <div className="font-mono text-brand text-[12px] font-semibold uppercase tracking-[0.04em] mb-6">
                Open source framework
              </div>
              <h1 className="font-mono text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-[-0.03em] mb-6 text-balance">
                One backend.<br />
                Ship everywhere.
              </h1>
              <p className="font-sans text-lg md:text-xl text-[#888] mb-8 max-w-xl leading-[1.6]">
                Define your schema once. Get REST, typed routes, realtime, typed client SDK, and optional admin UI. Server-first TypeScript. Built on Drizzle, Zod, Better Auth.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <Button variant="primary">Get started <ArrowRight className="w-4 h-4" /></Button>
                <Button variant="secondary"><Github className="w-4 h-4" /> GitHub ★</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>TypeScript</Badge>
                <Badge>Server-first</Badge>
                <Badge>Zero lock-in</Badge>
                <Badge>MIT license</Badge>
              </div>
            </div>

            <div className="relative">
              <TerminalBlock 
                label="src/questpie/server/collections/posts.ts"
                code={
                  <>
                    <span className="token-function">collection</span>(<span className="token-string">"posts"</span>)<br/>
                    &nbsp;&nbsp;.<span className="token-function">fields</span>((&#123; f &#125;) <span className="token-keyword">=&gt;</span> (&#123;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;title:&nbsp;&nbsp;&nbsp;f.<span className="token-function">text</span>(<span className="token-number">255</span>).<span className="token-function">required</span>(),<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;content:&nbsp;f.<span className="token-function">richText</span>().<span className="token-function">localized</span>(),<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;status:&nbsp;&nbsp;f.<span className="token-function">select</span>([<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123; value: <span className="token-string">"draft"</span>, label: <span className="token-string">"Draft"</span> &#125;,<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123; value: <span className="token-string">"published"</span>, label: <span className="token-string">"Published"</span> &#125;,<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;]),<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;author:&nbsp;&nbsp;f.<span className="token-function">relation</span>(<span className="token-string">"users"</span>).<span className="token-function">required</span>(),<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;cover:&nbsp;&nbsp;&nbsp;f.<span className="token-function">file</span>().<span className="token-function">image</span>(),<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;tags:&nbsp;&nbsp;&nbsp;&nbsp;f.<span className="token-function">relation</span>(<span className="token-string">"tags"</span>).<span className="token-function">hasMany</span>(&#123; foreignKey: <span className="token-string">"postId"</span> &#125;),<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;seo:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f.<span className="token-function">object</span>(&#123;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title: f.<span className="token-function">text</span>(),<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;desc:&nbsp;&nbsp;f.<span className="token-function">text</span>(<span className="token-number">160</span>),<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&#125;),<br/>
                    &nbsp;&nbsp;&#125;))<br/>
                    &nbsp;&nbsp;.<span className="token-function">access</span>(&#123;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;read:&nbsp;&nbsp;&nbsp;<span className="token-keyword">true</span>,<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;create: (&#123; session &#125;) <span className="token-keyword">=&gt;</span> !!session,<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;update: (&#123; session, doc &#125;) <span className="token-keyword">=&gt;</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;doc.authorId === session?.user?.id,<br/>
                    &nbsp;&nbsp;&#125;)<br/>
                    &nbsp;&nbsp;.<span className="token-function">versioning</span>(&#123; enabled: <span className="token-keyword">true</span>, maxVersions: <span className="token-number">10</span> &#125;)
                  </>
                }
              />
              <div className="absolute -bottom-6 -right-6 bg-brand text-white font-mono text-[12px] p-4 border border-surface-border shadow-2xl hidden md:block">
                <div className="flex items-center gap-2 mb-1"><Check className="w-3 h-3"/> REST API</div>
                <div className="flex items-center gap-2 mb-1"><Check className="w-3 h-3"/> Typed client SDK</div>
                <div className="flex items-center gap-2 mb-1"><Check className="w-3 h-3"/> Admin panel</div>
                <div className="flex items-center gap-2"><Check className="w-3 h-3"/> Zod validation</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 01: One schema */}
        <section className="px-4 md:px-8 py-16 md:py-24 max-w-[1200px] mx-auto border-t border-surface-border">
          <div className="mb-12">
            <div className="text-brand font-mono text-[14px] tracking-[3px] mb-4">01</div>
            <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">One schema, everything generated</h2>
            <p className="font-sans text-[#888] text-lg max-w-2xl">Define once. Get the rest for free.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-surface-border border border-surface-border">
            <div className="lg:col-span-5 bg-surface-bg">
              <TerminalBlock 
                label="schema.ts"
                code={
                  <>
                    <span className="token-comment">// This one definition generates:</span><br/>
                    <span className="token-comment">// REST, Routes, Admin, Validation,</span><br/>
                    <span className="token-comment">// Client SDK, Realtime, Search</span><br/>
                    <br/>
                    <span className="token-function">collection</span>(<span className="token-string">"posts"</span>)<br/>
                    &nbsp;&nbsp;.<span className="token-function">fields</span>((&#123; f &#125;) <span className="token-keyword">=&gt;</span> (&#123;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;title:&nbsp;&nbsp;&nbsp;f.<span className="token-function">text</span>(<span className="token-number">255</span>).<span className="token-function">required</span>(),<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;content:&nbsp;f.<span className="token-function">richText</span>().<span className="token-function">localized</span>(),<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;status:&nbsp;&nbsp;f.<span className="token-function">select</span>([...]).<span className="token-function">required</span>(),<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;author:&nbsp;&nbsp;f.<span className="token-function">relation</span>(<span className="token-string">"users"</span>),<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;cover:&nbsp;&nbsp;&nbsp;f.<span className="token-function">file</span>().<span className="token-function">image</span>(),<br/>
                    &nbsp;&nbsp;&#125;))
                  </>
                }
              />
            </div>
            <div className="lg:col-span-7 bg-surface-bg grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-surface-border">
              <div className="bg-surface-bg p-6">
                <div className="flex items-center gap-2 text-brand mb-2"><Globe className="w-4 h-4" /> <span className="font-mono text-[13px] font-bold text-white">REST API</span></div>
                <p className="font-mono text-[11px] text-[#666]">/api/collections/posts</p>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="flex items-center gap-2 text-brand mb-2"><FileCode className="w-4 h-4" /> <span className="font-mono text-[13px] font-bold text-white">Typed routes</span></div>
                <p className="font-mono text-[11px] text-[#666]">typed, namespaced</p>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="flex items-center gap-2 text-brand mb-2"><Activity className="w-4 h-4" /> <span className="font-mono text-[13px] font-bold text-white">Realtime via SSE</span></div>
                <p className="font-mono text-[11px] text-[#666]">subscribe to changes</p>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="flex items-center gap-2 text-brand mb-2"><Box className="w-4 h-4" /> <span className="font-mono text-[13px] font-bold text-white">Typed client SDK</span></div>
                <p className="font-mono text-[11px] text-[#666]">auto-generated types</p>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="flex items-center gap-2 text-brand mb-2"><LayoutDashboard className="w-4 h-4" /> <span className="font-mono text-[13px] font-bold text-white">Admin panel</span></div>
                <p className="font-mono text-[11px] text-[#666]">table, form, block editor</p>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="flex items-center gap-2 text-brand mb-2"><Check className="w-4 h-4" /> <span className="font-mono text-[13px] font-bold text-white">Zod validation</span></div>
                <p className="font-mono text-[11px] text-[#666]">from field definitions</p>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="flex items-center gap-2 text-brand mb-2"><Lock className="w-4 h-4" /> <span className="font-mono text-[13px] font-bold text-white">Access control</span></div>
                <p className="font-mono text-[11px] text-[#666]">row-level, field-level</p>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="flex items-center gap-2 text-brand mb-2"><Layers className="w-4 h-4" /> <span className="font-mono text-[13px] font-bold text-white">Versioning</span></div>
                <p className="font-mono text-[11px] text-[#666]">workflow stages, drafts → published</p>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="flex items-center gap-2 text-brand mb-2"><Globe className="w-4 h-4" /> <span className="font-mono text-[13px] font-bold text-white">i18n</span></div>
                <p className="font-mono text-[11px] text-[#666]">two-table strategy, per-field localization</p>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="flex items-center gap-2 text-brand mb-2"><HardDrive className="w-4 h-4" /> <span className="font-mono text-[13px] font-bold text-white">File Storage</span></div>
                <p className="font-mono text-[11px] text-[#666]">auto-managed uploads & assets</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: File system */}
        <section className="px-4 md:px-8 py-16 md:py-24 max-w-[1200px] mx-auto border-t border-surface-border">
          <div className="mb-12">
            <div className="text-brand font-mono text-[14px] tracking-[3px] mb-4">02</div>
            <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">File system = source of truth</h2>
            <p className="font-sans text-[#888] text-lg max-w-2xl">Drop a file. Get a feature. Grouped by type. Codegen discovers everything. No manual registration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-surface-border border border-surface-border">
            <div className="bg-surface-bg p-8 font-mono text-[13px] leading-[1.8] text-[#ccc]">
              <div className="flex gap-6 mb-6 border-b border-surface-border pb-2">
                <span className="text-white border-b-2 border-brand pb-2 -mb-[9px]">By type</span>
                <span className="text-[#666]">By feature</span>
              </div>
              <div className="text-brand mb-4">src/questpie/server/</div>
              <div className="flex"><span className="text-surface-border mr-2">├──</span> collections/</div>
              <div className="flex"><span className="text-surface-border mr-2">│   ├──</span> <span className="text-white">posts.ts</span></div>
              <div className="flex"><span className="text-surface-border mr-2">│   └──</span> <span className="text-white">users.ts</span></div>
              <div className="flex"><span className="text-surface-border mr-2">├──</span> routes/</div>
              <div className="flex"><span className="text-surface-border mr-2">│   └──</span> <span className="text-white">admin/stats.ts</span></div>
              <div className="flex"><span className="text-surface-border mr-2">├──</span> blocks/</div>
              <div className="flex"><span className="text-surface-border mr-2">│   └──</span> <span className="text-white">hero.ts</span></div>
              <div className="flex"><span className="text-surface-border mr-2">├──</span> jobs/</div>
              <div className="flex"><span className="text-surface-border mr-2">│   └──</span> <span className="text-white">send-newsletter.ts</span></div>
              <div className="flex"><span className="text-surface-border mr-2">└──</span> <span className="text-white">auth.ts</span></div>
            </div>
            <div className="bg-surface-bg p-8 flex flex-col justify-center gap-6">
              <div>
                <div className="font-mono text-[12px] text-white font-bold mb-1">posts.ts</div>
                <div className="font-mono text-[10px] text-brand uppercase tracking-[0.1em]">CRUD + API + ADMIN</div>
              </div>
              <div>
                <div className="font-mono text-[12px] text-white font-bold mb-1">admin/stats.ts</div>
                <div className="font-mono text-[10px] text-brand uppercase tracking-[0.1em]">TYPE-SAFE ROUTE</div>
              </div>
              <div>
                <div className="font-mono text-[12px] text-white font-bold mb-1">hero.ts</div>
                <div className="font-mono text-[10px] text-brand uppercase tracking-[0.1em]">VISUAL BLOCK</div>
              </div>
              <div>
                <div className="font-mono text-[12px] text-white font-bold mb-1">send-newsletter.ts</div>
                <div className="font-mono text-[10px] text-brand uppercase tracking-[0.1em]">BACKGROUND JOB</div>
              </div>
              <div>
                <div className="font-mono text-[12px] text-white font-bold mb-1">users.ts</div>
                <div className="font-mono text-[10px] text-brand uppercase tracking-[0.1em]">AUTH-CONNECTED ENTITY</div>
              </div>
              <div>
                <div className="font-mono text-[12px] text-white font-bold mb-1">stripe.ts</div>
                <div className="font-mono text-[10px] text-brand uppercase tracking-[0.1em]">SINGLETON SERVICE</div>
              </div>
              <div>
                <div className="font-mono text-[12px] text-white font-bold mb-1">demo-data.ts</div>
                <div className="font-mono text-[10px] text-brand uppercase tracking-[0.1em]">DB SEED</div>
              </div>
              <div>
                <div className="font-mono text-[12px] text-white font-bold mb-1">auth.ts</div>
                <div className="font-mono text-[10px] text-brand uppercase tracking-[0.1em]">BETTER AUTH</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: Swap anything */}
        <section className="px-4 md:px-8 py-16 md:py-24 max-w-[1200px] mx-auto border-t border-surface-border">
          <div className="mb-12">
            <div className="text-brand font-mono text-[14px] tracking-[3px] mb-4">03</div>
            <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">Swap anything</h2>
            <p className="font-sans text-[#888] text-lg max-w-2xl">Your infrastructure. Your choice. Write your own adapter in under 50 lines.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1px] bg-surface-border border border-surface-border">
            <div className="bg-surface-bg grid grid-cols-2 gap-[1px] bg-surface-border">
              <div className="bg-surface-bg p-6">
                <div className="font-mono text-[11px] text-[#666] uppercase tracking-[0.1em] mb-2">Runtime</div>
                <div className="font-sans text-[14px] text-white">Node.js · Bun · Cloudflare Workers · Deno</div>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="font-mono text-[11px] text-[#666] uppercase tracking-[0.1em] mb-2">Database</div>
                <div className="font-sans text-[14px] text-white">PostgreSQL · PGlite · Neon · PlanetScale</div>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="font-mono text-[11px] text-[#666] uppercase tracking-[0.1em] mb-2">Queue</div>
                <div className="font-sans text-[14px] text-white">pg-boss · Cloudflare Queues</div>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="font-mono text-[11px] text-[#666] uppercase tracking-[0.1em] mb-2">HTTP</div>
                <div className="font-sans text-[14px] text-white">Hono · Elysia · Next.js · TanStack Start</div>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="font-mono text-[11px] text-[#666] uppercase tracking-[0.1em] mb-2">Search</div>
                <div className="font-sans text-[14px] text-white">Postgres FTS · pgvector</div>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="font-mono text-[11px] text-[#666] uppercase tracking-[0.1em] mb-2">Realtime</div>
                <div className="font-sans text-[14px] text-white">PG NOTIFY · Redis Streams</div>
              </div>
              <div className="bg-surface-bg p-6">
                <div className="font-mono text-[11px] text-[#666] uppercase tracking-[0.1em] mb-2">Storage</div>
                <div className="font-sans text-[14px] text-white">Local · S3 · R2 · GCS (FlyDrive)</div>
              </div>
            </div>
            <div className="bg-surface-bg">
              <TerminalBlock 
                label="questpie.config.ts"
                code={
                  <>
                    <span className="token-function">runtimeConfig</span>(&#123;<br/>
                    &nbsp;&nbsp;db: &#123; url: DATABASE_URL &#125;,<br/>
                    &nbsp;&nbsp;queue: &#123; adapter: <span className="token-function">pgBossAdapter</span>() &#125;,<br/>
                    &nbsp;&nbsp;search: <span className="token-function">postgresSearchAdapter</span>(),<br/>
                    &nbsp;&nbsp;realtime: &#123; adapter: <span className="token-function">pgNotifyAdapter</span>() &#125;,<br/>
                    &nbsp;&nbsp;storage: &#123; driver: <span className="token-function">s3Driver</span>(&#123;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;bucket: <span className="token-string">"assets"</span><br/>
                    &nbsp;&nbsp;&#125;) &#125;,<br/>
                    &nbsp;&nbsp;email: &#123; adapter: <span className="token-function">smtpAdapter</span>() &#125;,<br/>
                    &#125;)
                  </>
                }
              />
            </div>
          </div>
        </section>

        {/* Section 04: Optional admin */}
        <section className="px-4 md:px-8 py-16 md:py-24 max-w-[1200px] mx-auto border-t border-surface-border">
          <div className="mb-12">
            <div className="text-brand font-mono text-[14px] tracking-[3px] mb-4">04</div>
            <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">Optional admin</h2>
            <p className="font-sans text-[#888] text-lg max-w-2xl">Ship the admin panel only when you need it. Swappable package. Web, React Native, or build your own.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1px] bg-surface-border border border-surface-border">
            <div className="bg-surface-bg">
              <TerminalBlock 
                label="admin.ts"
                code={
                  <>
                    <span className="token-function">collection</span>(<span className="token-string">"posts"</span>)<br/>
                    &nbsp;&nbsp;.<span className="token-function">admin</span>((&#123; c &#125;) <span className="token-keyword">=&gt;</span> (&#123;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;label: &#123; en: <span className="token-string">"Posts"</span>, sk: <span className="token-string">"Príspevky"</span> &#125;,<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;icon: c.<span className="token-function">icon</span>(<span className="token-string">"ph:article"</span>),<br/>
                    &nbsp;&nbsp;&#125;))<br/>
                    &nbsp;&nbsp;.<span className="token-function">list</span>((&#123; v, f &#125;) <span className="token-keyword">=&gt;</span> v.<span className="token-function">table</span>(&#123;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;columns: [<span className="token-string">"title"</span>, <span className="token-string">"status"</span>, <span className="token-string">"author"</span>],<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;defaultSort: &#123; field: f.createdAt, direction: <span className="token-string">"desc"</span> &#125;,<br/>
                    &nbsp;&nbsp;&#125;))<br/>
                    &nbsp;&nbsp;.<span className="token-function">form</span>((&#123; v, f &#125;) <span className="token-keyword">=&gt;</span> v.<span className="token-function">form</span>(&#123;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;fields: [f.title, f.content],<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;sidebar: &#123; fields: [f.status, f.author] &#125;,<br/>
                    &nbsp;&nbsp;&#125;))
                  </>
                }
              />
            </div>
            <div className="bg-surface-bg p-6 flex flex-col">
              <div className="border border-surface-border flex-1 flex flex-col">
                <div className="h-10 border-b border-surface-border flex items-center px-4 justify-between bg-[#111]">
                  <div className="font-mono text-[12px] font-bold">Admin</div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-surface-border"></div>
                    <div className="w-2 h-2 bg-surface-border"></div>
                    <div className="w-2 h-2 bg-surface-border"></div>
                  </div>
                </div>
                <div className="flex-1 flex">
                  <div className="w-32 border-r border-surface-border p-4 hidden sm:block">
                    <ul className="space-y-3 font-mono text-[11px] text-[#666]">
                      <li className="text-brand font-bold">Posts</li>
                      <li>Users</li>
                      <li>Settings</li>
                      <li>Assets</li>
                      <li>Audit log</li>
                    </ul>
                  </div>
                  <div className="flex-1 p-4 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="font-mono text-[10px] uppercase text-[#666] pb-2 border-b border-surface-border font-normal">Title</th>
                        <th className="font-mono text-[10px] uppercase text-[#666] pb-2 border-b border-surface-border font-normal">Status</th>
                        <th className="font-mono text-[10px] uppercase text-[#666] pb-2 border-b border-surface-border font-normal">Author</th>
                      </tr>
                    </thead>
                    <tbody className="font-sans text-[13px]">
                      <tr>
                        <td className="py-3 border-b border-surface-border text-white whitespace-nowrap pr-4">Getting Started Guide</td>
                        <td className="py-3 border-b border-surface-border pr-4"><Badge>PUBLISHED</Badge></td>
                        <td className="py-3 border-b border-surface-border text-[#888] pr-4">admin</td>
                      </tr>
                      <tr>
                        <td className="py-3 border-b border-surface-border text-white whitespace-nowrap pr-4">Adapter Architecture</td>
                        <td className="py-3 border-b border-surface-border pr-4"><span className="px-2 py-0.5 bg-surface-border text-[#888] font-mono text-[11px] uppercase">DRAFT</span></td>
                        <td className="py-3 border-b border-surface-border text-[#888] pr-4">admin</td>
                      </tr>
                      <tr>
                        <td className="py-3 border-b border-surface-border text-white whitespace-nowrap pr-4">File Conventions</td>
                        <td className="py-3 border-b border-surface-border pr-4"><Badge>PUBLISHED</Badge></td>
                        <td className="py-3 border-b border-surface-border text-[#888] pr-4">admin</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Section 05: End-to-end types */}
        <section className="px-4 md:px-8 py-16 md:py-24 max-w-[1200px] mx-auto border-t border-surface-border">
          <div className="mb-12">
            <div className="text-brand font-mono text-[14px] tracking-[3px] mb-4">05</div>
            <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">End-to-end types</h2>
            <p className="font-sans text-[#888] text-lg max-w-2xl">Schema to screen. Zero disconnect. Change a field — TypeScript catches it everywhere.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-surface-border border border-surface-border">
            <div className="lg:col-span-4 bg-surface-bg p-8 flex flex-col justify-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-surface-input flex items-center justify-center font-mono text-[12px] text-brand">1</div>
                <div className="font-mono text-[13px] text-white">Field def</div>
              </div>
              <div className="w-px h-4 bg-surface-border ml-4"></div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-surface-input flex items-center justify-center font-mono text-[12px] text-brand">2</div>
                <div className="font-mono text-[13px] text-white">Codegen</div>
              </div>
              <div className="w-px h-4 bg-surface-border ml-4"></div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-surface-input flex items-center justify-center font-mono text-[12px] text-brand">3</div>
                <div className="font-mono text-[13px] text-white">Drizzle table & Zod schema</div>
              </div>
              <div className="w-px h-4 bg-surface-border ml-4"></div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-surface-input flex items-center justify-center font-mono text-[12px] text-brand">4</div>
                <div className="font-mono text-[13px] text-white">Client SDK</div>
              </div>
              <div className="w-px h-4 bg-surface-border ml-4"></div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-brand flex items-center justify-center font-mono text-[12px] text-white">5</div>
                <div className="font-mono text-[13px] text-white font-bold">React</div>
              </div>
            </div>
            <div className="lg:col-span-8 bg-surface-bg">
              <TerminalBlock 
                label="client.ts"
                code={
                  <>
                    <span className="token-keyword">const</span> &#123; docs &#125; = <span className="token-keyword">await</span> client.collections.posts.<span className="token-function">find</span>(&#123;<br/>
                    &nbsp;&nbsp;where: &#123; status: &#123; eq: <span className="token-string">"published"</span> &#125; &#125;,<br/>
                    &nbsp;&nbsp;orderBy: &#123; createdAt: <span className="token-string">"desc"</span> &#125;,<br/>
                    &nbsp;&nbsp;with: &#123; author: <span className="token-keyword">true</span>, tags: <span className="token-keyword">true</span> &#125;,<br/>
                    &nbsp;&nbsp;locale: <span className="token-string">"sk"</span>,<br/>
                    &#125;);<br/>
                    <br/>
                    <span className="token-comment">// docs[0].title → string</span><br/>
                    <span className="token-comment">// docs[0].author → User</span><br/>
                    <span className="token-comment">// docs[0].tags → Tag[]</span>
                  </>
                }
              />
            </div>
          </div>
        </section>

        {/* Section 06: Composable */}
        <section className="px-4 md:px-8 py-16 md:py-24 max-w-[1200px] mx-auto border-t border-surface-border">
          <div className="mb-12">
            <div className="text-brand font-mono text-[14px] tracking-[3px] mb-4">06</div>
            <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">Composable</h2>
            <p className="font-sans text-[#888] text-lg max-w-2xl">Core parts = user code. Modules compose depth-first with deduplication. Every module uses the exact same conventions as user code.</p>
          </div>

          <BrutalistGrid>
            <FeatureCell 
              num="01" 
              title="questpie-starter" 
              desc="Auth, users, sessions, API keys, assets. Better Auth integration. Default access. i18n messages." 
            />
            <FeatureCell 
              num="02" 
              title="questpie-admin" 
              desc="Admin UI. 18 field renderers, 3 view types, sidebar, dashboard widgets. Table, form, block editor." 
            />
            <FeatureCell 
              num="03" 
              title="questpie-audit" 
              desc="Change logging via global hooks. Every create, update, delete tracked. Zero config required." 
            />
            <FeatureCell 
              num="04" 
              title="Your module" 
              desc="Same file conventions, same patterns. Build your own module. Publish to npm. No special APIs." 
            />
          </BrutalistGrid>
        </section>

        {/* Section 07: Developer experience */}
        <section className="px-4 md:px-8 py-16 md:py-24 max-w-[1200px] mx-auto border-t border-surface-border">
          <div className="mb-12">
            <div className="text-brand font-mono text-[14px] tracking-[3px] mb-4">07</div>
            <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">Developer experience</h2>
            <p className="font-sans text-[#888] text-lg max-w-2xl">The details matter. Instant regeneration, typed scaffolding, build-time validation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-surface-border border border-surface-border">
            <div className="bg-surface-bg p-8">
              <div className="font-mono text-[11px] text-[#666] uppercase tracking-[0.1em] mb-4">WATCH</div>
              <div className="font-mono text-[13px] text-[#ccc] leading-[1.6]">
                <span className="text-brand">$</span> questpie dev<br/>
                <span className="text-semantic-success">✓</span> Watching...<br/>
                <span className="text-semantic-success">✓</span> server (23 collections)<br/>
                <span className="text-semantic-success">✓</span> admin-client (15 blocks)
              </div>
            </div>
            <div className="bg-surface-bg p-8">
              <div className="font-mono text-[11px] text-[#666] uppercase tracking-[0.1em] mb-4">SCAFFOLD</div>
              <div className="font-mono text-[13px] text-[#ccc] leading-[1.6]">
                <span className="text-brand">$</span> questpie add collection products<br/>
                <span className="text-semantic-success">✓</span> Created collections/products.ts<br/>
                <span className="text-semantic-success">✓</span> Regenerated types
              </div>
            </div>
            <div className="bg-surface-bg p-8">
              <div className="font-mono text-[11px] text-[#666] uppercase tracking-[0.1em] mb-4">VALIDATE</div>
              <div className="font-mono text-[13px] text-[#ccc] leading-[1.6]">
                <span className="text-semantic-error">✗</span> Server defines blocks/hero<br/>
                &nbsp;&nbsp;but no renderer found<br/>
                <span className="text-brand">→</span> Create admin/blocks/hero.tsx
              </div>
            </div>
            <div className="bg-surface-bg p-8">
              <div className="font-mono text-[11px] text-[#666] uppercase tracking-[0.1em] mb-4">REALTIME</div>
              <div className="font-mono text-[13px] text-[#ccc] leading-[1.6]">
                client.realtime.<span className="token-function">subscribe</span>(<br/>
                &nbsp;&nbsp;&#123; resource: <span className="token-string">"posts"</span> &#125;,<br/>
                &nbsp;&nbsp;(event) <span className="token-keyword">=&gt;</span> <span className="token-function">updateUI</span>(event)<br/>
                );
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-8 py-24 md:py-32 max-w-[1200px] mx-auto border-t border-surface-border text-center">
          <QSymbol className="w-12 h-12 mx-auto mb-8" />
          <h2 className="font-mono text-4xl md:text-5xl font-extrabold mb-6">One backend. Ship everywhere.</h2>
          <div className="inline-flex items-center gap-4 bg-surface-input border border-surface-border px-6 py-3 mb-8">
            <span className="font-mono text-brand">$</span>
            <span className="font-mono text-[14px]">npx create-questpie</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Button variant="primary">Read the docs <ArrowRight className="w-4 h-4" /></Button>
            <Button variant="secondary">Browse examples <ArrowRight className="w-4 h-4" /></Button>
            <Button variant="ghost"><Github className="w-4 h-4" /> Star on GitHub</Button>
          </div>
        </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-bg">
        <div className="max-w-[1200px] mx-auto border-x border-surface-border px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
            <div className="font-mono font-bold text-lg tracking-tight mb-4">QUESTPIE</div>
            <p className="font-sans text-[13px] text-[#666] mb-4">Open source · Server-first TypeScript framework</p>
            <div className="font-mono text-[11px] text-[#555]">MIT License</div>
          </div>
          <div>
            <div className="font-mono text-[12px] font-bold mb-4 uppercase tracking-[0.04em]">Product</div>
            <ul className="space-y-2 font-sans text-[13px] text-[#888]">
              <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Getting Started</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Releases</a></li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[12px] font-bold mb-4 uppercase tracking-[0.04em]">Ecosystem</div>
            <ul className="space-y-2 font-sans text-[13px] text-[#888]">
              <li><a href="#" className="hover:text-white transition-colors">Hono</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Elysia</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Next.js</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TanStack</a></li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[12px] font-bold mb-4 uppercase tracking-[0.04em]">Community</div>
            <ul className="space-y-2 font-sans text-[13px] text-[#888]">
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Issues</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pull Requests</a></li>
            </ul>
          </div>
          </div>
          <div className="mt-12 pt-8 border-t border-surface-border flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-sans text-[12px] text-[#555]">© 2026 QUESTPIE s.r.o. · IČO: 54027292</div>
            <div className="font-mono text-[11px] text-[#555]">TypeScript · Drizzle · Zod · Better Auth · Hono</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
