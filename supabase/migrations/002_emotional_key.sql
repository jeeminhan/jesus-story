create type emotional_key as enum ('grief', 'doubt', 'searching', 'curiosity', 'anger');

alter table arcs
add column emotional_key emotional_key;

create index if not exists arcs_emotional_key_idx on arcs(emotional_key);
