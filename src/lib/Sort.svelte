<script lang="ts">
	import { Popover, ToggleGroup, ToggleOption, Tooltip, Button, Icon } from "svelte-ux"
	import { sortKeysLabels } from "./constants"
	import SortIcon from "./icons/sort.svg?raw"
	import ArrowUpIcon from "./icons/arrow-up.svg?raw"
	import ArrowDownIcon from "./icons/arrow-down.svg?raw"
	import { sortToggleOrder, sortKey, sortOrder } from "./store"
    
	let openSortingMenu: boolean = false
</script>

<div class="inline-block h-full mx-4">
    <Popover bind:open={openSortingMenu} placement="right-start">
        <ToggleGroup
            vertical
            variant="fill"
            class="ml-1"
            classes={{indicator: "border-2 border-secondary", label: "bg-secondary/60 text-secondary-content hover:bg-secondary hover:text-secondary-content"}}
            bind:value={$sortKey}
        >
            {#each Object.entries(sortKeysLabels) as pair (pair[0]) }
            <ToggleOption 
                classes={{ option: "py-2 !mt-0" }} 
                on:click={() => {$sortToggleOrder++}} 
                value={pair[0]}
            >
                {pair[1]}
                {#if $sortKey === pair[0]}
                    {#if $sortOrder === 'asc'}
                        <Icon data={ArrowUpIcon}/>
                    {:else if $sortOrder === 'desc'}
                        <Icon data={ArrowDownIcon}/>
                    {/if}
                {/if}
            </ToggleOption>
            {/each }
        </ToggleGroup>
    </Popover>
    
    <Tooltip title="Sorted by: {sortKeysLabels[$sortKey]}" classes={{title: "font-semibold"}}>
        <Button
        variant="default"
        color="default"
        class="bg-surface-100/10 rounded max-md:px-2 ml-auto h-full text-primary-content"
        icon={SortIcon}
        on:click={() => {openSortingMenu = !openSortingMenu}}
        />
    </Tooltip>
</div>

