import Link from "next/link";

type FamilyListProps = {
  familyMembers: SantaInFamily[];
  isViewerAdmin: boolean;
};

type SantaInFamily = {
  santa: {
    first_name: string;
    last_name: string;
  };
  santa_id: string;
  santa_is_admin: boolean;
};

const FamilyList = ({
  familyMembers,
  isViewerAdmin,
}: FamilyListProps): JSX.Element => {
  return (
    <ol>
      {familyMembers.map((s: SantaInFamily) => (
        <FamilyMember
          key={`${s.santa_id}`}
          id={s.santa_id}
          firstName={s.santa.first_name}
          lastName={s.santa.last_name}
          isViewerAdmin={isViewerAdmin}
        />
      ))}
    </ol>
  );
};

type FamilyMemberProps = {
  id: string;
  firstName: string;
  lastName: string;
  isViewerAdmin: boolean;
};

const FamilyMember = ({
  id,
  firstName,
  lastName,
  isViewerAdmin,
}: FamilyMemberProps): JSX.Element => {
  return (
    <li>
      <Link href={`/s/${id}`}>{`${firstName} ${lastName}`}</Link>
      {isViewerAdmin && <span style={{ marginLeft: "2rem" }}> d </span>}
    </li>
  );
};

export default FamilyList;

// const FamilyList = ({
//   familyMembers,
//   questions,
//   isViewerAdmin,
// }: FamilyListProps): JSX.Element => {
//   return (
//     <Container>
//       <Accordion>
//         {familyMembers.map((s: SantaInFamily, i: number) => {
//           return (
//             <Row key={s.santa_id} className="justify-content-center">
//               <Col>
//                 <Card>
//                   <Card.Header>
//                     <NameToggle eventKey={i.toString()}>
//                       {s.santa.first_name}
//                     </NameToggle>

//                     {/* Add Heart And Trash (if admin) */}
//                   </Card.Header>
//                   <Accordion.Collapse eventKey={i.toString()}>
//                     <Card.Body>
//                       {questions?.map((q: QuestionInfo) => {
//                         let answer: AnswerInfo | undefined =
//                           s.santa.Answers?.find((a) => a.question_id == q.id);
//                         return (
//                           <Card key={`${q.family_id}-${q.id}`}>
//                             <Card.Header>{q.text}</Card.Header>
//                             <Card.Body>
//                               {answer
//                                 ? answer?.text
//                                 : `${s.santa.first_name} has not answered this question yet!`}
//                             </Card.Body>
//                           </Card>
//                         );
//                       })}
//                     </Card.Body>
//                   </Accordion.Collapse>
//                 </Card>
//               </Col>
//             </Row>
//           );
//         })}
//       </Accordion>
//     </Container>
//   );
// };
