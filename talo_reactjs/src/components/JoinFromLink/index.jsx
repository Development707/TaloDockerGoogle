import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const JoinFromLink = () => {
    const { conversationId } = useParams();

    const navigate = useNavigate();
    useEffect(() => {
        navigate('/chat', { state: { conversationId } });
        //eslint-disable-next-line
    }, [conversationId]);

    return <div>{conversationId}</div>;
};

export default JoinFromLink;
