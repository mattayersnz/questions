import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

export default function useNoteMutations(project) {
  return {
    createNote: useCreateNote(project),
    updateNote: useUpdateNote(project),
    deleteNote: useDeleteNote(project),
  };
}

const CreateNoteMutation = gql`
  mutation CreateNote($note: NoteInsertInput!) {
    createdNote: insertOneNote(data: $note) {
      _id
      _partition
      blocks {
        type
        children {
          text
          type
          bold
          italic
          underline
          strikethrough
          linkNoteId
        }
      }
    }
  }
`;

const UpdateNoteMutation = gql`
  mutation UpdateNote($noteId: ObjectId!, $updates: NoteUpdateInput!) {
    updatedNote: updateOneNote(query: { _id: $noteId }, set: $updates) {
      _id
      _partition
      blocks {
        type
        children {
          text
          type
          bold
          italic
          underline
          strikethrough
          linkNoteId
        }
      }
    }
  }
`;

const DeleteNoteMutation = gql`
  mutation DeleteNote($noteId: ObjectId!) {
    deletedNote: deleteOneNote(query: { _id: $noteId }) {
      _id
      _partition
    }
  }
`;

const NoteFieldsFragment = gql`
  fragment NoteFields on Note {
    _id
    _partition
    blocks {
      type
      children {
        text
        type
        bold
        italic
        underline
        strikethrough
        linkNoteId
      }
    }
  }
`;

function useCreateNote(project) {
  const [createNoteMutation] = useMutation(CreateNoteMutation, {
    // Manually save added Notes into the Apollo cache so that Note queries automatically update
    // For details, refer to https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    update: (cache, { data: { createdNote } }) => {
      cache.modify({
        fields: {
          notes: (existingNotes = []) => [
            ...existingNotes,
            cache.writeFragment({
              data: createdNote,
              fragment: NoteFieldsFragment,
            }),
          ],
        },
      });
    },
  });

  const createNote = async (newId, note) => {
    const { createdNote } = await createNoteMutation({
      variables: {
        note: {
          _id: newId,
          _partition: `note=${project.id}`,
          ownerId: project.id,
          ...note,
        },
      }
    });
    return createdNote;
  };
  return createNote;
}

function useUpdateNote(project) {
  const [updateNoteMutation] = useMutation(UpdateNoteMutation, {
    // Manually save added Notes into the Apollo cache so that Note queries automatically update
    // For details, refer to https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    update: (cache, { data: { updatedNote } }) => {
      cache.modify({
        fields: {
          notes: (existingNotes = []) => { 
            //removes the note from cache when saving to override what there
            const filteredNotes = existingNotes.filter((value) => value && value._ref !== updatedNote._partition );
            return [
              ...filteredNotes
            ]
          },
        },
      });
    },
  });

  const updateNote = async (noteId, updates) => {
    const { updatedNote } = await updateNoteMutation({
      variables: { noteId: noteId, updates },
    });
    return updatedNote;
  };
  return updateNote;
}

function useDeleteNote(project) {
  const [deleteNoteMutation] = useMutation(DeleteNoteMutation);
  const deleteNote = async (noteId) => {
    const { deletedNote } = await deleteNoteMutation({
      variables: { noteId: noteId },
    });
    return deletedNote;
  };
  return deleteNote;
}