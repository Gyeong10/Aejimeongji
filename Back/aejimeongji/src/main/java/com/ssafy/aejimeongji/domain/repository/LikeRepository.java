package com.ssafy.aejimeongji.domain.repository;

import com.ssafy.aejimeongji.domain.entity.GuideBook;
import com.ssafy.aejimeongji.domain.entity.Like;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByMemberId(Long memberId);
    Optional<Like> findByMemberIdAndGuideBookId(Long memberId, Long guideId);

    @Query("select g From Like l " +
            "join fetch l.guideBook g join fetch g.thumbnail t " +
            "where l.member.id = :memberId " +
            "and l.id < :curLastIdx " +
            "order by l.id desc ")
    Slice<GuideBook> findLikeGuideBook(Long memberId, Long curLastIdx, Pageable request);
}