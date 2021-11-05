export const createDiagram = (contractDiagram) => {
  let diagramStringArray = [];
  let transitions = [];
  let stateActive = [];
  diagramStringArray.push("stateDiagram-v2");
  stateActive.push("state Active {");
  Object.entries(contractDiagram.transitions).forEach(([key, transition]) => {
    const event = createEvent(transition);
    const formattedTransition = `${
      transition.source === "initial" ? "[*]" : transition.source
    } --> ${transition.target}${event && `: ${event}`}`;
    if (
      (transition.source === "in_effect" &&
        transition.target === "suspended") ||
      (transition.source === "suspended" && transition.target === "in_effect")
    ) {
      stateActive.push(formattedTransition)
    } else {
        transitions.push(formattedTransition)
    }
  });
  stateActive.push("}")
  transitions.push(`successful_termination --> [*]`);
  transitions.push(`unsuccessful_termination --> [*]`);
  const arrayStateNotes = Object.entries(contractDiagram.states).map(
    ([key, state]) => {
      let descriptionDetails = "";
      if (contractDiagram.state_actions[key]) {
        descriptionDetails = createDescription(
          contractDiagram.state_actions[key]
        );
        descriptionDetails = `${descriptionDetails}<br><br>`;
      }

      return `${key} : ${descriptionDetails}<strong>${state}<strong>`;
    }
  );

  diagramStringArray = [...diagramStringArray, ...stateActive, ...transitions, ...arrayStateNotes];

  return diagramStringArray.join("\r\n");
};

const createEvent = (transition) => {
  const events = transition.events.map((event) => {
    const actions = formatValues(transition, event?.actions);
    const formattedEvent = formatValues(transition, [event?.event]);
    return `${formattedEvent} ${event.guard ? "[" + event.guard + "]" : ""}${
      actions && ` / ${actions}`
    }`;
  });
  return events.join("<br>");
};

const formatValues = (event, values = []) => {
  const regex = /\$\{(?<name>\w+)\}/;
  const formattedValues = [];
  values.forEach((value) => {
    const matchAction = value.match(regex);
    if (matchAction && matchAction.groups) {
      const name = matchAction.groups.name;
      if (event[name] && event[name].length > 0) {
        let fill = "";
        if (Array.isArray(event[name])) {
          if (Array.isArray(event[name][0])) {
            const items = event[name].map((item) => item.join());
            fill = items.join(" OR ");
          } else {
            fill = event[name].join();
          }
        } else {
          fill = event[name];
        }

        const formatted = value.replace("${" + name + "}", `<strong>${fill}</strong>`);
        formattedValues.push(formatted);
      }
    } else {
      formattedValues.push(value);
    }
  });

  return formattedValues.join("<br>");
};

const createDescription = (state) => {
  const action = formatValues(state, [state?.action]);
  return `${state.when} / ${action}`;
};
