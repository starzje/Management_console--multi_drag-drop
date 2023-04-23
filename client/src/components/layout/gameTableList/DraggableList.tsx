import * as React from "react";
import { DragDropContext, Droppable, Draggable, DraggableStateSnapshot, DraggableProvided } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { gamesSelector } from "../../../redux/features";
import { GameListElement } from "../../layout";
import { useDragAndDrop, useClickHandler, useWindowEvents } from "../../../hooks";

export const DraggableList = () => {
  const games = useSelector(gamesSelector);

  useWindowEvents();
  const { onDragStart, onDragEnd, isGhosting } = useDragAndDrop(games);
  const { handleClick } = useClickHandler({ forCheckbox: false });

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <Droppable droppableId="droppable">
        {(provided) => {
          return (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {games.map((item, index) => (
                <Draggable key={item.gameID} draggableId={item.gameID.toString()} index={index}>
                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
                    return (
                      <GameListElement
                        isGhosting={isGhosting}
                        handleClick={handleClick}
                        provided={provided}
                        snapshot={snapshot}
                        item={item}
                        key={item.gameID}
                      />
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};
