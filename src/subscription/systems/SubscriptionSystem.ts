import { Behavior } from "../../common/interfaces/Behavior"
import { BehaviorValue } from "../../common/interfaces/BehaviorValue"
import { Entity } from "../../ecs/classes/Entity"
import { Attributes, System } from "../../ecs/classes/System"
import { Subscription } from "../components/Subscription"
import { registerComponent, getComponent } from "../../ecs"

export class SubscriptionSystem extends System {
  init(): void {
    registerComponent(Subscription)
  }
  private subscription: Subscription
  public execute(delta: number): void {
    this.queryResults.subscriptions.added?.forEach(entity => {
      this.callBehaviorsForHook(entity, { phase: "onAdded" }, delta)
    })

    this.queryResults.subscriptions.changed?.forEach(entity => {
      this.callBehaviorsForHook(entity, { phase: "onChanged" }, delta)
    })

    this.queryResults.subscriptions.results?.forEach(entity => {
      this.callBehaviorsForHook(entity, { phase: "onUpdate" }, delta)
      this.callBehaviorsForHook(entity, { phase: "onLateUpdate" }, delta)
    })

    this.queryResults.subscriptions.removed?.forEach(entity => {
      this.callBehaviorsForHook(entity, { phase: "onRemoved" }, delta)
    })
  }

  callBehaviorsForHook: Behavior = (entity: Entity, args: { phase: string }, delta: any) => {
    this.subscription = getComponent(entity, Subscription)
    // If the schema for this subscription component has any values in this phase
    if (this.subscription.schema[args.phase] !== undefined) {
      // Foreach value in this phase
      this.subscription.schema[args.phase].forEach((value: BehaviorValue) => {
        // Call the behavior with the args supplied in the schema, as well as delta provided here
        value.behavior(entity, value.args ? value.args : null, delta)
      })
    }
  }
}

SubscriptionSystem.systemQueries = {
  subscriptions: {
    components: [Subscription],
    listen: {
      added: true,
      changed: true,
      removed: true
    }
  }
}
