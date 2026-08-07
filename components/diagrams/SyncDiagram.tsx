"use client";

import {
  Band, Datastore, DiagramFrame, External, FlowArrow, Gateway, Queue, Service,
  TraceParticle,
} from "./primitives";

export type DiagramMode = "topology" | "sequence" | "failure";

const dimFn = (mode: DiagramMode, id: string) => {
  if (mode === "topology") return false;
  if (mode === "sequence") return !["ui","gw","design","store","src","cdc","kafka","sync","dest","snapshot","wfs","agent"].includes(id);
  if (mode === "failure") return !["src","cdc","kafka","sync","dlq"].includes(id);
  return false;
};

export default function SyncDiagram({ mode = "topology", playKey = 0 }: { mode?: DiagramMode; playKey?: number }) {
  const dim = (id: string) => dimFn(mode, id);
  const de = (...ids: string[]) => (mode === "topology" ? false : ids.some(dim));
  const seq = mode === "sequence";
  const fail = mode === "failure";

  return (
    <DiagramFrame viewBox="0 0 1200 600" height={600}>
      {/* ═══════ Row 1: Client → API → Pipeline designer ═══════ */}
      <Band x={0} y={0} width={1200} height={100} label="Control plane" />

      <External x={50} y={24} w={150} label="Operator" sublabel="UI / CLI / API" tone={seq ? "accent" : "default"} dim={dim("ui")} />
      <Gateway x={250} y={24} w={160} label="SyncFlow API" sublabel="REST + SSE" tone={seq ? "accent" : "default"} dim={dim("gw")} />
      <FlowArrow x1={200} y1={44} x2={250} y2={44} label="configure" step={1} primary={seq} animated={seq} dim={de("ui","gw")} />

      <Service x={460} y={24} w={170} h={54} label="Pipeline Designer" sublabel="versioning + conflicts" tone={seq ? "accent" : "default"} dim={dim("design")} />
      <FlowArrow x1={410} y1={44} x2={460} y2={44} label="design" step={2} primary={seq} animated={seq} dim={de("gw","design")} />

      <Datastore x={680} y={30} w={130} h={52} label="Pipeline Store" sublabel="designs + versions" tone={seq ? "accent" : "default"} dim={dim("store")} />
      <FlowArrow x1={630} y1={50} x2={680} y2={50} primary={seq} animated={seq} dim={de("design","store")} />

      {/* ═══════ Row 2: Capture + transport ═══════ */}
      <Band x={0} y={110} width={1200} height={170} label="Capture + transport" />

      <External x={50} y={130} w={150} label="Source DB" sublabel="MySQL / Postgres / Mongo" tone={seq || fail ? "accent" : "default"} dim={dim("src")} />
      <Service x={250} y={130} w={180} h={54} label="Debezium CDC" sublabel="binlog change events" tone={seq || fail ? "accent" : "default"} dim={dim("cdc")} />
      <FlowArrow x1={210} y1={150} x2={250} y2={150} label="ROW-level" step={3} primary={seq} animated={seq} dim={de("src","cdc")} />

      <Queue x={500} y={130} w={180} h={52} label="Kafka" sublabel="topics + DLQ" tone={seq || fail ? "accent" : "async"} dim={dim("kafka")} />
      <FlowArrow x1={430} y1={150} x2={500} y2={150} label="publish" step={4} primary={seq} animated={seq} dim={de("cdc","kafka")} />

      <Service x={740} y={130} w={190} h={54} label="Sync Orchestrator" sublabel="processing + DLQ" tone={seq || fail ? "accent" : "default"} dim={dim("sync")} />
      <FlowArrow x1={680} y1={150} x2={740} y2={150} label="consume" step={5} primary={seq} animated={seq} dim={de("kafka","sync")} />

      <External x={990} y={150} w={160} label="Target DB" sublabel="Elastic · PG · Mongo" tone={seq ? "accent" : "default"} dim={dim("dst")} />
      <FlowArrow x1={930} y1={150} x2={990} y2={150} label="apply" step={6} primary={seq} animated={seq} dim={de("sync","dst")} />

      {/* ═══════ Row 3: Snapshot + workflow ═══════ */}
      <Band x={0} y={290} width={1200} height={140} label="Snapshot + scheduling" />

      <Service x={250} y={310} w={180} h={54} label="Snapshot Executor" sublabel="full-table backfill" tone={seq ? "accent" : "default"} dim={dim("snapshot")} />
      <FlowArrow x1={210} y1={180} x2={250} y2={310} primary={seq} animated={seq} dim={de("dst","snapshot")} />

      <Service x={500} y={310} w={190} h={54} label="Workflow Scheduler" sublabel="DAG + retries" tone={seq ? "accent" : "default"} dim={dim("wfs")} />
      <FlowArrow x1={430} y1={320} x2={500} y2={320} label="trigger" primary={seq} animated={seq} dim={de("sync","wfs")} />

      <Service x={740} y={310} w={190} h={54} label="Agent Fleet" sublabel="distributed workers" tone={seq ? "accent" : "default"} dim={dim("agent")} />
      <FlowArrow x1={690} y1={330} x2={740} y2={330} label="dispatch" primary={seq} animated={seq} dim={de("wfs","agent")} />

      {/* DLQ sits directly under the Sync Orchestrator so the failure edge is a
          short vertical drop — "detected a bad row → dead-lettered here". */}
      <Datastore x={742} y={375} w={190} h={52} label="Dead Letter Q" sublabel="replayable" tone={fail ? "failure" : "default"} dim={dim("dlq")} />

      {/* Sync Orchestrator → DLQ (failure edge) */}
      <FlowArrow x1={835} y1={184} x2={835} y2={375}
        tone="failure" primary={fail} animated={fail}
        step={fail ? 5 : undefined} label={fail ? "poison / DLQ" : undefined}
        dim={!fail && mode !== "topology"}
      />

      {/* ═══════ Row 4: Observability ═══════ */}
      <Band x={0} y={480} width={1200} height={100} label="Observability" />

      <External x={60} y={500} w={200} label="Prometheus / Grafana" sublabel="Micrometer metrics" dim={dim("obs")} />
      <FlowArrow x1={260} y1={525} x2={330} y2={525} label="metrics + SSE status" dim={de("obs")} />

      {/* Trace particle — animates the happy path during sequence mode.
          Follows the caption: Operator configures → Designer persists to Store →
          CDC reads a source change → Kafka → Sync → Target. */}
      {seq && (
        <TraceParticle
          playKey={playKey}
          duration={6}
          tone="accent"
          path={[
            "M 200 44",     // Operator → API
            "L 410 44",     // → Designer (design)
            "L 630 44",     // → Designer right edge → Store
            "L 745 40",     // → Pipeline Store (persist version)
            "L 210 150",    // → Source DB (CDC tails a change)
            "L 430 150",    // → Kafka (CDC publishes)
            "L 680 150",    // → Sync Orchestrator (consumes)
            "L 930 150",    // → Target DB (applies)
          ].join(" ")}
        />
      )}

      {/* Failure trace — poison message routed to the DLQ */}
      {fail && (
        <TraceParticle
          playKey={playKey}
          duration={4}
          tone="failure"
          path={[
            "M 210 150",    // Source DB → CDC
            "L 430 150",    // → Kafka
            "L 835 150",    // → Sync Orchestrator
            "L 835 375",    // → DLQ (dead-lettered)
          ].join(" ")}
        />
      )}
    </DiagramFrame>
  );
}